import React from "react";
import { mount } from "enzyme";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

const Form = () => <div />;
jest.mock(
    "./components/SubmissionSuite/Form",
    () => ({
        __esModule: true,
        default: Form,
    }),
    { virtual: true }
);
const GoodbyePage = () => <div />;
jest.mock(
    "./components/SubmissionSuite/GoodbyePage",
    () => ({
        __esModule: true,
        default: GoodbyePage,
    }),
    { virtual: true }
);
const NotFoundPage = () => <div />;
jest.mock(
    "./components/NotFoundPage",
    () => ({
        __esModule: true,
        default: NotFoundPage,
    }),
    { virtual: true }
);

describe("<App />", () => {
    it("renders the Form page at /:submitterId/submit", () => {
        let wrapper = mount(
            <MemoryRouter initialEntries={["/anon-13iusd91/submit"]}>
                <App />
            </MemoryRouter>
        );
        expect(wrapper.find(Form)).toHaveLength(1);
        expect(wrapper.children()).toHaveLength(1);
        wrapper = mount(
            <MemoryRouter initialEntries={["/some-specific-user/submit"]}>
                <App />
            </MemoryRouter>
        );
        expect(wrapper.find(Form)).toHaveLength(1);
        expect(wrapper.children()).toHaveLength(1);
    });
    it("renders the Goodbye page at /:submitterId/goodbye", () => {
        let wrapper = mount(
            <MemoryRouter initialEntries={["/anon-13iusd91/goodbye"]}>
                <App />
            </MemoryRouter>
        );
        expect(wrapper.find(GoodbyePage)).toHaveLength(1);
        expect(wrapper.children()).toHaveLength(1);
        wrapper = mount(
            <MemoryRouter initialEntries={["/some-specific-user/goodbye"]}>
                <App />
            </MemoryRouter>
        );
        expect(wrapper.find(GoodbyePage)).toHaveLength(1);
        expect(wrapper.children()).toHaveLength(1);
    });
    it("renders the Not Found page at other routes", () => {
        let wrapper = mount(
            <MemoryRouter initialEntries={["/"]}>
                <App />
            </MemoryRouter>
        );
        expect(wrapper.find(NotFoundPage)).toHaveLength(1);
        expect(wrapper.children()).toHaveLength(1);
        wrapper = mount(
            <MemoryRouter initialEntries={["/submit"]}>
                <App />
            </MemoryRouter>
        );
        expect(wrapper.find(NotFoundPage)).toHaveLength(1);
        expect(wrapper.children()).toHaveLength(1);
        wrapper = mount(
            <MemoryRouter initialEntries={["/nonsense"]}>
                <App />
            </MemoryRouter>
        );
        expect(wrapper.find(NotFoundPage)).toHaveLength(1);
        expect(wrapper.children()).toHaveLength(1);
        wrapper = mount(
            <MemoryRouter initialEntries={["/two-parts-of/the-user/submit"]}>
                <App />
            </MemoryRouter>
        );
        expect(wrapper.find(NotFoundPage)).toHaveLength(1);
        expect(wrapper.children()).toHaveLength(1);
        wrapper = mount(
            <MemoryRouter initialEntries={["/this/is/a/path"]}>
                <App />
            </MemoryRouter>
        );
        expect(wrapper.find(NotFoundPage)).toHaveLength(1);
        expect(wrapper.children()).toHaveLength(1);
        wrapper = mount(
            <MemoryRouter initialEntries={["/submit/not/here"]}>
                <App />
            </MemoryRouter>
        );
        expect(wrapper.find(NotFoundPage)).toHaveLength(1);
        expect(wrapper.children()).toHaveLength(1);
    });
});
