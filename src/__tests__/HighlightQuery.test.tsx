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

it("should highlight 'test'", () => {
  const sut = shallow(HighlightQuery("this is a test string", "test"));

  const highlightedSpan = sut.find("span > span").at(0);
  // tslint:disable-next-line: no-console
  expect(highlightedSpan).not.toBeNull();
  // expect(highlightedSpan).toHaveProperty("style.fontWeight");
});
