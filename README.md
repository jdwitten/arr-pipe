# array-pipe

A functional, declarative, and typesafe library for composing operations on arrays.

## ✨ Core Features

### 🔧 pipe

The main function that allows you to compose array operations together. Each operation in the pipe must take an array as input and return an array as output.

```typescript
const lessThan = (num: number) => (arr: number[]) =>
  arr.filter((item) => item < num);

const operation = pipe(lessThan(8), lessThan(5));

operation([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
// [1, 2, 3, 4]
```

### 🔄 Higher Order Operations

#### union

Combines the results of two array operations, similar to a SET UNION operation.

```typescript
const greaterThan = (num: number) => (arr: number[]) =>
  arr.filter((item) => item > num);
const lessThan = (num: number) => (arr: number[]) =>
  arr.filter((item) => item < num);
const operation = union(greaterThan(8), lessThan(5));

operation([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
// [1, 2, 3, 4, 9, 10]
```

#### intersection

Finds common elements between two array operations, similar to a SET INTERSECTION operation.

```typescript
const greaterThan = (num: number) => (arr: number[]) =>
  arr.filter((item) => item > num);
const lessThan = (num: number) => (arr: number[]) =>
  arr.filter((item) => item < num);

const operation = intersection(greaterThan(8), lessThan(5));
operation([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
// []
```

## 🎯 Key Benefits

- **Type Safety**: Cannot construct pipes where output types don't match input types
- **Array-Specific**: Built specifically for array operations
- **Composable**: Easy to build complex pipelines from simple operations
- **Flexible**: Works with various data types (numbers, objects, strings, etc.)

## 🔍 Real World Use Cases

Perfect for building:

- Search result pipelines
- Recommendation feeds
- Data transformation chains
- Filter and sort combinations

## 🧪 Testing

Run the test suite:

```bash:README.md
yarn test
```

## 📚 Learn More

Check out the [blog post](https://jwitt.dev/post/array-pipe) for a detailed explanation of the implementation and use cases.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Publishing New Versions

To publish a new version:

1. Update version in package.json
2. Commit changes
3. Run `./scripts/publish`

This will publish to npm and create a git tag.

## 📄 License

MIT License
