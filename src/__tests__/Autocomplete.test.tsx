import * as React from "react";
import { shallow, mount, render } from "enzyme";
import { Autocomplete } from "../Autocomplete";
import { HighlightQuery } from "../HighlightQuery";

it("should render", () => {
  const sut = render(
    <Autocomplete value="" onLoadOptions={(query: string) => []} />
  );
  expect(sut).toMatchSnapshot();
});
