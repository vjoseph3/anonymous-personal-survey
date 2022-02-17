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
            expect.stringMatching(
                /^You can update your submission at any time at https?:\/\/.+\/some-specific-user\/submit/
            )
        );
    });
    it("renders a link to resubmit", () => {
        const a = wrapper.find("p").find("a");
        expect(a).toHaveLength(1);
        expect(a.text()).toEqual(
            expect.stringMatching(/^https?:\/\/.+\/some-specific-user\/submit/)
        );
        expect(a.prop("href")).toEqual(
            expect.stringMatching(/^https?:\/\/.+\/some-specific-user\/submit/)
        );
    });
});
