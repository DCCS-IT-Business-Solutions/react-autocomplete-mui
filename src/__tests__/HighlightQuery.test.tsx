import * as React from "react";
import { shallow, mount, render } from "enzyme";
import { HighlightQuery } from "../HighlightQuery";

it("should render", () => {
  const sut = render(HighlightQuery("this is a test string", "test"));
  expect(sut).toMatchSnapshot();
});

it("test HighlightQuery", () => {
  const sut = shallow(HighlightQuery("this is a test string", "test"));

  // const highlightedSpan = sut.find("<span>");
  // // tslint:disable-next-line: no-console
  // console.log(highlightedSpan);
  // expect(highlightedSpan).toHaveProperty("style");
  // // expect(highlightedSpan).toHaveProperty("style.fontWeight");
});
