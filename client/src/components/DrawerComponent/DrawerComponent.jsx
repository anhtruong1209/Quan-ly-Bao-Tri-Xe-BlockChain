import { Drawer } from "antd";
import React from "react";

const DrawerComponent = ({
  title = "Drawer",
  placement = "right",
  isOpen = false,
  children,
  ...rests
}) => {
  return (
    <>
      <Drawer
        style={{ marginTop: "70px", paddingBottom: "50px" }}
        title={title}
        placemen={placement}
        open={isOpen}
        {...rests}
      >
        {children}
      </Drawer>
    </>
  );
};

export default DrawerComponent;
