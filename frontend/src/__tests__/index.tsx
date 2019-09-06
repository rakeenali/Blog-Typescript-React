import '@testing-library/jest-dom/extend-expect'

import * as React from "react";
import { render } from "@testing-library/react";

test("IT works", () => {
    const { container } = render(<div>hi</div>)
    expect(container.firstChild).toHaveTextContent("hi")
})