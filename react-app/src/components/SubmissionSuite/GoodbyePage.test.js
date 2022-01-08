import React from "react";
import { mount } from "enzyme";
import { MemoryRouter } from "react-router-dom";
import GoodbyePage from "./GoodbyePage";

describe("<GoodbyePage />", () => {
    let wrapper;
    beforeAll(() => {
        wrapper = mount(
            <MemoryRouter>
                <GoodbyePage submitterId="some-specific-user" />
            </MemoryRouter>
        );
    });
    it("renders the correct text", () => {
        const h2 = wrapper.find("h2");
        expect(h2).toHaveLength(1);
        expect(h2.text()).toEqual("Thank you for your submission!");
        const p = wrapper.find("p");
        expect(p).toHaveLength(1);
        expect(p.text()).toEqual(
            "You can safely close this window, or" + "change and resubmit"
        );
    });
    it("renders a link to resubmit", () => {
        const link = wrapper.find("p").find("Link");
        expect(link).toHaveLength(1);
        expect(link.find("button").text()).toEqual("change and resubmit");
        expect(link.prop("to")).toEqual("/some-specific-user/submit");
    });
});
