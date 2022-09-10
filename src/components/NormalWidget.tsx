import { FC } from "react";
import { styled } from "@stitches/react";

interface Props {
  title?: string;
}

const Box = styled("div", {
  background: "#5CB8E4",
  borderRadius: 12,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
  width: "100%",
  color: "#F2F2F2",
  fontFamily: "Anek Telugu",
  cursor: "move",
});

export const NormalWidget: FC<Props> = ({ title = "Normal Widget" }) => {
  return (
    <Box>
      <h2>{title}</h2>
    </Box>
  );
};
