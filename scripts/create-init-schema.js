const fs = require("fs");

fs.readFile(__dirname + "/../src/index.tsx", "utf8", (err, content) => {
  if (err) {
    console.error(err);
    return;
  }

  const schema = {
    name: "dynamic-prompt",
    type: "registry:block",
    dependencies: [],
    devDependencies: [],
    registryDependencies: ["select"],
    files: [
      {
        path: "components/dynamic-prompt.tsx",
        type: "registry:block",
        content: content,
      },
    ],
    tailwind: {},
    cssVars: {},
    meta: {
      importSpecifier: "DynamicPrompt",
      moduleSpecifier: "@/components/dynamic-prompt",
    },
  };

  fs.writeFile("./init/dynamic-prompt.json", JSON.stringify(schema), (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("init-schema.sql created");
  });
});
