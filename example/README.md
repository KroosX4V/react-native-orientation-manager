# Instructions
- Ensure that you download the entire repository, not just the `example` folder, as the app relies on the module files located at the directory level above.

# Steps to Run the App:

## Step 1: Installing Dependencies

Install dependencies by running the following commands from the _root_ of the repository:

```bash
yarn
```
```bash
cd example/ios
```
```bash
bundle install
```
```bash
bundle exec pod install
```

## Step 2: Start the Metro Server

To start Metro, run the following command from the _root_ of the repository:

```bash
yarn example start
```

## Step 3: Start the App

Let the Metro server run in its _own_ terminal. Open a _new_ terminal from the _root_ of the repository. Run the following command to start the _Android_, _iOS_, or _Windows_ app:

### For Android:

```bash
yarn example android
```

### For iOS:

```bash
yarn example ios
```

### For Windows:

```bash
yarn example windows
```