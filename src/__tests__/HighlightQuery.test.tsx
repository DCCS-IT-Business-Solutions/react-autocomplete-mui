import * as React from "react";
import { shallow, mount, render } from "enzyme";
import { HighlightQuery } from "../HighlightQuery";

it("should render", () => {
  const sut = render(HighlightQuery("this is a test string", "test"));
  expect(sut).toMatchSnapshot();
});

it("should render with query being null", () => {
  const sut = render(HighlightQuery("this is a test string", null));
  expect(sut).toMatchSnapshot();
});

it("should render with text being null", () => {
  const sut = render(HighlightQuery(null, "test"));
  expect(sut).toMatchSnapshot();
});

it("should render with custom style", () => {
  const sut = render(HighlightQuery(null, "test", { backgroundColor: "red" }));
  expect(sut).toMatchSnapshot();
});

it("should highlight 'test'", () => {
  const sut = shallow(HighlightQuery("this is a test string", "test")).setProps(
    {}
  );
  const highlightedSpan = sut.find("span > span").get(0);
  const style = highlightedSpan.props.style.fontWeight;
  expect(style).toBe("bold");

  const text = sut
    .find("span > span")
    .at(0)
    .text();
  expect(text).toBe("test");
});

it("should not highlight anything", () => {
  const sut = shallow(HighlightQuery("this is a test string", "")).setProps({});

  expect(sut.children("span").length).toBe(0);
});

it("should highlight 'test' with custom style", () => {
  const sut = shallow(
    HighlightQuery("this is a test string", "test", { backgroundColor: "red" })
  ).setProps({});

  const highlightedSpan = sut.find("span > span").get(0);
  const style = highlightedSpan.props.style.backgroundColor;
  expect(style).toBe("red");
});
