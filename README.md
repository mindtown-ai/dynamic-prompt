# Dynamic Prompt Component

#### [Experimental - Work in Progress]

This component allows you to dynamically render text fields and select inputs based on the provided data.

![demo](./demo.gif)

## Installation

Currently only available with `shadcn`.

```sh
npx shadcn add "https://raw.githubusercontent.com/mindtown-ai/dynamic-prompt/main/schema.json"
```

## Usage

Here's an example of how to use the `DynamicPrompt` component:

```jsx
import React from "react";
import DynamicPrompt from "@/components/DynamicPrompt";

const data = {
  text: "Hello, {name}! Please select your favorite fruit: {fruit}.",
  options: {
    name: ["Alice", "Bob", "Charlie"],
    fruit: ["Apple", "Banana", "Cherry"],
  },
};

const App = () => {
  const handleChange = (text: string) => {
    console.log("Updated text:", text);
  };

  return <DynamicPrompt data={data} onChange={handleChange} />;
};

export default App;
```

## Prop Types

```ts
interface DynamicTextFieldProps {
  onChange: (text: string) => void;
  CustomSelect?: React.ComponentType<any>;
  data: { text: string; options: { [key: string]: string[] } };
}
```

### License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
