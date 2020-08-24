export default interface RepositoryInterface<T> {
  create(instance: T): T;

  all(): T[];
}
