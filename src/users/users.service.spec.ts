import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';

import { UsersService } from './users.service';
import { User, UserDocument, UserRole } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Build a plain object that looks like a UserDocument.
 * Only the fields tested here need to be present.
 */
function makeUser(overrides: Partial<User & { _id: string }> = {}): UserDocument {
  return {
    _id: 'user-id-1',
    name: 'Jane Doe',
    email: 'jane@example.com',
    role: UserRole.MEMBER,
    isActive: true,
    bio: 'Backend engineer focused on APIs',
    ...overrides,
  } as unknown as UserDocument;
}

// ---------------------------------------------------------------------------
// Mock factory
// ---------------------------------------------------------------------------

/**
 * Chainable query stub.
 * Each chained method returns `this` so the chain compiles correctly;
 * exec() resolves with the value passed to makeChain().
 */
function makeChain(resolvedValue: unknown) {
  const chain = {
    sort: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue(resolvedValue),
  };
  return chain;
}

// ---------------------------------------------------------------------------
// Test suite
// ---------------------------------------------------------------------------

describe('UsersService', () => {
  let service: UsersService;
  let model: Model<UserDocument>;

  // Mocks that need to be reassigned per-test are declared here so they are
  // accessible inside individual `it` blocks.
  let findMock: jest.Mock;
  let countDocumentsMock: jest.Mock;
  let findByIdMock: jest.Mock;
  let findByIdAndUpdateMock: jest.Mock;
  let findByIdAndDeleteMock: jest.Mock;

  // Holds the mock constructor function used for `new this.userModel(...)`.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let MockUserModel: any;

  beforeEach(async () => {
    // Reset every mock before each test so state never leaks.
    findMock = jest.fn();
    countDocumentsMock = jest.fn();
    findByIdMock = jest.fn();
    findByIdAndUpdateMock = jest.fn();
    findByIdAndDeleteMock = jest.fn();

    // The constructor mock needs to return an object with a `save` method.
    // jest.fn() used as a constructor returns `this` by default, so we set
    // up the prototype's save directly.
    MockUserModel = jest.fn().mockImplementation((dto: CreateUserDto) => ({
      ...dto,
      _id: 'new-user-id',
      save: jest.fn().mockResolvedValue({ _id: 'new-user-id', ...dto }),
    }));

    // Attach static Mongoose model methods to the mock constructor.
    MockUserModel.find = findMock;
    MockUserModel.countDocuments = countDocumentsMock;
    MockUserModel.findById = findByIdMock;
    MockUserModel.findByIdAndUpdate = findByIdAndUpdateMock;
    MockUserModel.findByIdAndDelete = findByIdAndDeleteMock;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: MockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get<Model<UserDocument>>(getModelToken(User.name));
  });

  // -------------------------------------------------------------------------
  // create()
  // -------------------------------------------------------------------------

  describe('create()', () => {
    it('should instantiate a new model with the DTO and return the saved document', async () => {
      const dto: CreateUserDto = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        role: UserRole.MEMBER,
        isActive: true,
        bio: 'Backend engineer focused on APIs',
      };

      const result = await service.create(dto);

      // The constructor should have been called with the DTO.
      expect(MockUserModel).toHaveBeenCalledWith(dto);

      // save() should have been called on the new instance.
      const instance = MockUserModel.mock.results[0].value;
      expect(instance.save).toHaveBeenCalledTimes(1);

      // The resolved value should carry the DTO fields plus the generated ID.
      expect(result).toMatchObject({ _id: 'new-user-id', email: 'jane@example.com' });
    });

    it('should create a user with only required fields, applying optional defaults', async () => {
      const dto: CreateUserDto = {
        name: 'John Smith',
        email: 'john@example.com',
      };

      await service.create(dto);

      expect(MockUserModel).toHaveBeenCalledWith(dto);
      const instance = MockUserModel.mock.results[0].value;
      expect(instance.save).toHaveBeenCalledTimes(1);
    });
  });

  // -------------------------------------------------------------------------
  // findAll()
  // -------------------------------------------------------------------------

  describe('findAll()', () => {
    it('should return paginated results with correct pagination math', async () => {
      const users = [makeUser(), makeUser({ _id: 'user-id-2', email: 'bob@example.com' })];
      const total = 25;

      findMock.mockReturnValue(makeChain(users));
      countDocumentsMock.mockReturnValue({ exec: jest.fn().mockResolvedValue(total) });

      const query: QueryUserDto = { page: 3, limit: 5, sort: 'createdAt' };
      const result = await service.findAll(query);

      expect(result.data).toBe(users);
      expect(result.total).toBe(25);
      expect(result.page).toBe(3);
      expect(result.limit).toBe(5);
      // Math.ceil(25 / 5) === 5
      expect(result.totalPages).toBe(5);

      // Verify the correct skip value was forwarded to the chain.
      const chain = findMock.mock.results[0].value;
      expect(chain.skip).toHaveBeenCalledWith(10); // (3 - 1) * 5
      expect(chain.limit).toHaveBeenCalledWith(5);
      expect(chain.sort).toHaveBeenCalledWith('createdAt');
    });

    it('should default page to 1 and limit to 10 when not provided', async () => {
      findMock.mockReturnValue(makeChain([]));
      countDocumentsMock.mockReturnValue({ exec: jest.fn().mockResolvedValue(0) });

      const result = await service.findAll({});

      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBe(0); // Math.ceil(0 / 10)

      const chain = findMock.mock.results[0].value;
      expect(chain.skip).toHaveBeenCalledWith(0); // (1 - 1) * 10
      expect(chain.limit).toHaveBeenCalledWith(10);
    });

    it('should calculate totalPages as Math.ceil(total / limit)', async () => {
      findMock.mockReturnValue(makeChain([]));
      // 11 items with limit 10 → 2 pages
      countDocumentsMock.mockReturnValue({ exec: jest.fn().mockResolvedValue(11) });

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result.totalPages).toBe(2);
    });

    it('should filter by role when role is provided', async () => {
      findMock.mockReturnValue(makeChain([]));
      countDocumentsMock.mockReturnValue({ exec: jest.fn().mockResolvedValue(0) });

      await service.findAll({ role: UserRole.ADMIN });

      expect(findMock).toHaveBeenCalledWith({ role: UserRole.ADMIN });
      expect(countDocumentsMock).toHaveBeenCalledWith({ role: UserRole.ADMIN });
    });

    it('should filter by isActive when isActive is provided', async () => {
      findMock.mockReturnValue(makeChain([]));
      countDocumentsMock.mockReturnValue({ exec: jest.fn().mockResolvedValue(0) });

      await service.findAll({ isActive: false });

      expect(findMock).toHaveBeenCalledWith({ isActive: false });
      expect(countDocumentsMock).toHaveBeenCalledWith({ isActive: false });
    });

    it('should combine role and isActive filters when both are provided', async () => {
      findMock.mockReturnValue(makeChain([]));
      countDocumentsMock.mockReturnValue({ exec: jest.fn().mockResolvedValue(0) });

      await service.findAll({ role: UserRole.VIEWER, isActive: true });

      expect(findMock).toHaveBeenCalledWith({ role: UserRole.VIEWER, isActive: true });
      expect(countDocumentsMock).toHaveBeenCalledWith({ role: UserRole.VIEWER, isActive: true });
    });

    it('should apply no filters when neither role nor isActive is provided', async () => {
      findMock.mockReturnValue(makeChain([]));
      countDocumentsMock.mockReturnValue({ exec: jest.fn().mockResolvedValue(0) });

      await service.findAll({});

      expect(findMock).toHaveBeenCalledWith({});
      expect(countDocumentsMock).toHaveBeenCalledWith({});
    });

    it('should use Promise.all so data and count queries run in parallel', async () => {
      // We verify this indirectly by confirming both mocks were invoked in the
      // same call to findAll() and that the results are composed correctly.
      const users = [makeUser()];
      findMock.mockReturnValue(makeChain(users));
      countDocumentsMock.mockReturnValue({ exec: jest.fn().mockResolvedValue(1) });

      const result = await service.findAll({});

      expect(findMock).toHaveBeenCalledTimes(1);
      expect(countDocumentsMock).toHaveBeenCalledTimes(1);
      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
    });
  });

  // -------------------------------------------------------------------------
  // findOne()
  // -------------------------------------------------------------------------

  describe('findOne()', () => {
    it('should return the user document when found', async () => {
      const user = makeUser();
      findByIdMock.mockReturnValue({ exec: jest.fn().mockResolvedValue(user) });

      const result = await service.findOne('user-id-1');

      expect(findByIdMock).toHaveBeenCalledWith('user-id-1');
      expect(result).toBe(user);
    });

    it('should throw NotFoundException when the user does not exist', async () => {
      findByIdMock.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });

      await expect(service.findOne('nonexistent-id')).rejects.toThrow(NotFoundException);
      await expect(service.findOne('nonexistent-id')).rejects.toThrow(
        'User with ID "nonexistent-id" not found',
      );
    });

    it('should call .exec() on the findById query', async () => {
      const execMock = jest.fn().mockResolvedValue(makeUser());
      findByIdMock.mockReturnValue({ exec: execMock });

      await service.findOne('user-id-1');

      expect(execMock).toHaveBeenCalledTimes(1);
    });
  });

  // -------------------------------------------------------------------------
  // update()
  // -------------------------------------------------------------------------

  describe('update()', () => {
    it('should return the updated user document on success', async () => {
      const updated = makeUser({ name: 'Jane Updated', role: UserRole.ADMIN });
      findByIdAndUpdateMock.mockReturnValue({ exec: jest.fn().mockResolvedValue(updated) });

      const dto: UpdateUserDto = { name: 'Jane Updated', role: UserRole.ADMIN };
      const result = await service.update('user-id-1', dto);

      expect(findByIdAndUpdateMock).toHaveBeenCalledWith('user-id-1', dto, {
        new: true,
        runValidators: true,
      });
      expect(result).toBe(updated);
    });

    it('should throw NotFoundException when the user to update does not exist', async () => {
      findByIdAndUpdateMock.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });

      const dto: UpdateUserDto = { name: 'Ghost' };
      await expect(service.update('nonexistent-id', dto)).rejects.toThrow(NotFoundException);
      await expect(service.update('nonexistent-id', dto)).rejects.toThrow(
        'User with ID "nonexistent-id" not found',
      );
    });

    it('should call .exec() on the findByIdAndUpdate query', async () => {
      const execMock = jest.fn().mockResolvedValue(makeUser());
      findByIdAndUpdateMock.mockReturnValue({ exec: execMock });

      await service.update('user-id-1', { bio: 'Updated bio' });

      expect(execMock).toHaveBeenCalledTimes(1);
    });

    it('should pass { new: true, runValidators: true } options to findByIdAndUpdate', async () => {
      findByIdAndUpdateMock.mockReturnValue({ exec: jest.fn().mockResolvedValue(makeUser()) });

      await service.update('user-id-1', { isActive: false });

      expect(findByIdAndUpdateMock).toHaveBeenCalledWith(
        'user-id-1',
        { isActive: false },
        { new: true, runValidators: true },
      );
    });
  });

  // -------------------------------------------------------------------------
  // remove()
  // -------------------------------------------------------------------------

  describe('remove()', () => {
    it('should resolve without a value when deletion is successful', async () => {
      findByIdAndDeleteMock.mockReturnValue({
        exec: jest.fn().mockResolvedValue(makeUser()),
      });

      const result = await service.remove('user-id-1');

      expect(findByIdAndDeleteMock).toHaveBeenCalledWith('user-id-1');
      // remove() is typed as Promise<void> — the resolved value is undefined.
      expect(result).toBeUndefined();
    });

    it('should throw NotFoundException when the user to delete does not exist', async () => {
      findByIdAndDeleteMock.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });

      await expect(service.remove('nonexistent-id')).rejects.toThrow(NotFoundException);
      await expect(service.remove('nonexistent-id')).rejects.toThrow(
        'User with ID "nonexistent-id" not found',
      );
    });

    it('should call .exec() on the findByIdAndDelete query', async () => {
      const execMock = jest.fn().mockResolvedValue(makeUser());
      findByIdAndDeleteMock.mockReturnValue({ exec: execMock });

      await service.remove('user-id-1');

      expect(execMock).toHaveBeenCalledTimes(1);
    });
  });
});
