type Nominal<Type, Tag> = Type & { brand: Tag; };
// Reference : https://betterprogramming.pub/nominal-typescript-eee36e9432d2

type Resolve<T> = (value: T | PromiseLike<T>) => void

export type { Nominal };
export type { Resolve };

