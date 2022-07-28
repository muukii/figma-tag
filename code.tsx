// This is a counter widget with buttons to increment and decrement the number.

const { widget } = figma;
const { useSyncedState, usePropertyMenu, AutoLayout, Text, SVG, Input, Frame } =
  widget;

type Result = {
  text: string;
  textNode: TextNode;
};

function Widget() {
  const [results, setResults] = useSyncedState("results", [] as Result[]);

  const run = () => {
    // https://www.figma.com/plugin-docs/accessing-document#optimizing-traversals

    figma.skipInvisibleInstanceChildren = true;

    const result = figma.currentPage
      .findAllWithCriteria({ types: ["TEXT"] })
      .filter((textNode) => {
        const text = textNode.characters;

        if (text.startsWith("Key:") === false) {
          return false;
        }

        console.log(textNode.characters);

        return true;
      });

    const textNodes = result
      .map((e) => {
        return e as TextNode;
      })
      .map((e) => {
        return {
          text: e.characters.replace(/^(Key:)/, "").replace(" ", ""),
          textNode: e,
        } as Result;
      });

    setResults(textNodes);

    console.log(result);
  };

  return (
    <AutoLayout
      direction="vertical"
      verticalAlignItems={"center"}
      spacing={8}
      padding={16}
      cornerRadius={8}
      fill={"#FFFFFF"}
      stroke={"#E6E6E6"}
    >
      <Text fill="#3c49d6" onClick={() => run()}>
        Refresh
      </Text>

      {results.map((result) => {
        return (
          <AutoLayout
            direction="horizontal"
            verticalAlignItems={"center"}
            spacing={16}
            padding={16}
            cornerRadius={8}
            fill={"#FFFFFF"}
            stroke={"#E6E6E6"}
          >
            <Input
              key={result.textNode.id}
              value={result.text}
              onTextEditEnd={() => {}}
            />

            <Text
              fill="#5f9fd9"
              key={result.textNode.id}
              onClick={() => {
                figma.currentPage.selection = [result.textNode];

                // https://www.figma.com/plugin-docs/api/figma-viewport/#scrollandzoomintoview

                figma.viewport.scrollAndZoomIntoView([result.textNode]);
              }}
            >
              jump
            </Text>

            {/* <Text
              fill="#5f9fd9"
              key={result.textNode.id}
              onClick={() => {
                document.execCommand(result.text);
              }}
            >
              copy
            </Text> */}
          </AutoLayout>
        );
      })}
    </AutoLayout>
  );
}

widget.register(Widget);
