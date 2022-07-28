// This is a counter widget with buttons to increment and decrement the number.

const { widget } = figma;
const {
  useSyncedState,
  usePropertyMenu,
  AutoLayout,
  Text,
  SVG,
  Rectangle,
  Frame,
} = widget;

type Result = {
  text: string;
  textNode: TextNode;
};

function Widget() {
  const [results, setResults] = useSyncedState("results", [] as Result[]);

  const run = () => {
    const result = figma.currentPage.findChildren((node) => {
      switch (node.type) {
        case "TEXT":
          const textNode = node as TextNode;

          const text = textNode.characters;

          if (text.startsWith("Key:") === false) {
            return false;
          }

          console.log(textNode.characters);

          return true;
        default:
          return false;
      }
    });

    const textNodes = result
      .map((e) => {
        return e as TextNode;
      })
      .map((e) => {
        return {
          text: e.characters,
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
            <Text
              fill="#000000"
              key={result.textNode.id}
              onClick={() => {
                figma.currentPage.selection = [result.textNode];
              }}
            >
              {result.text}
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
