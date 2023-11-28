/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Popover, TextField, Typography } from "@mui/material";
import clsx from "clsx";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { TreeView, useTreeItem, TreeItem } from "@mui/x-tree-view";
import { flatten } from "./utils";

const CustomContent = React.forwardRef(function CustomContent(props, ref) {
  const {
    classes,
    className,
    label,
    nodeId,
    icon: iconProp,
    expansionIcon,
    displayIcon,
  } = props;

  const {
    disabled,
    expanded,
    selected,
    focused,
    handleExpansion,
    handleSelection,
    preventSelection,
  } = useTreeItem(nodeId);

  const icon = iconProp || expansionIcon || displayIcon;

  const handleMouseDown = (event) => {
    preventSelection(event);
  };

  const handleExpansionClick = (event) => {
    handleExpansion(event);
  };

  const handleSelectionClick = (event) => {
    handleSelection(event);
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={clsx(className, classes.root, {
        [classes.expanded]: expanded,
        [classes.selected]: selected,
        [classes.focused]: focused,
        [classes.disabled]: disabled,
      })}
      onMouseDown={handleMouseDown}
      ref={ref}
      style={{ padding: "3px 0" }}
    >
      <div onClick={handleExpansionClick} className={classes.iconContainer}>
        {icon}
      </div>
      <Typography
        onClick={handleSelectionClick}
        component="div"
        className={classes.label}
      >
        {label}
      </Typography>
    </div>
  );
});

export default function TreeSelectField({ formik, data, name, ...restProps }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const value = flatten([], data)?.find(
    ({ id }) => Number(formik?.values?.[name]) === Number(id)
  )?.name;

  console.log({ value });

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    formik?.setFieldTouched(name, true);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const renderTree = (nodes) => (
    <TreeItem
      ContentComponent={CustomContent}
      key={nodes.id}
      nodeId={nodes.id}
      label={nodes.name}
    >
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node))
        : null}
    </TreeItem>
  );

  return (
    <>
      <TextField {...restProps} value={value || ""} onClick={handleClick} />

      <Popover
        sx={{ width: "100%" }}
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <TreeView
          aria-label="icon expansion"
          defaultSelected={formik?.values?.[name]}
          selected={formik?.values?.[name]}
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          onNodeSelect={(e, id) => {
            formik?.setFieldValue(name, id);
          }}
          sx={{
            height: 200,
            flexGrow: 1,
            width: "350px",
            overflowY: "auto",
          }}
        >
          {data?.length >= 1 ? data?.map((item, i) => renderTree(item)) : null}
        </TreeView>
      </Popover>
    </>
  );
}
