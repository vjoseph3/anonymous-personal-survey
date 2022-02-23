import { mount, shallow } from "enzyme";
import toJson from "enzyme-to-json";
import { StatefulMock } from "../../../testUtils";
import MultipleChoice from "./MultipleChoice";

const mockUseState = jest.fn().mockImplementation((state) => {
    return [state, () => {}];
});
jest.mock("react", () => ({
    ...jest.requireActual("react"),
    useState: (state) => mockUseState(state),
}));

describe("<MultipleChoice />", () => {
    let data;
    beforeEach(() => {
        data = {};
    });
    it("renders the prompt", () => {
        let wrapper = new StatefulMock(
            () =>
                shallow(
                    <MultipleChoice
                        prompt="This is a prompt."
                        choices={["one"]}
                        data={data}
                    />
                ),
            mockUseState
        ).render();
        let p = wrapper.find("p");
        expect(p).toHaveLength(1);
        expect(p.text()).toEqual("This is a prompt.");

        wrapper = new StatefulMock(
            () =>
                shallow(
                    <MultipleChoice
                        prompt="This is a different prompt."
                        choices={["one"]}
                        data={data}
                    />
                ),
            mockUseState
        ).render();
        p = wrapper.find("p");
        expect(p).toHaveLength(1);
        expect(p.text()).toEqual("This is a different prompt.");
    });
    it("renders the buttons", () => {
        let wrapper = new StatefulMock(
            () =>
                mount(
                    <MultipleChoice
                        prompt="Prompt"
                        choices={["one", "two", "three"]}
                        data={data}
                    />
                ),
            mockUseState
        ).render();
        let buttons = wrapper.find("button");
        expect(buttons).toHaveLength(3);
        expect(buttons.at(0).text()).toEqual("one");
        expect(buttons.at(1).text()).toEqual("two");
        expect(buttons.at(2).text()).toEqual("three");

        wrapper = new StatefulMock(
            () =>
                shallow(
                    <MultipleChoice
                        prompt="Prompt"
                        choices={["one"]}
                        data={data}
                    />
                ),
            mockUseState
        ).render();
        buttons = wrapper.find("button");
        expect(buttons).toHaveLength(1);
        expect(buttons.text()).toEqual("one");

        wrapper = new StatefulMock(
            () =>
                shallow(
                    <MultipleChoice
                        prompt="Prompt"
                        choices={[
                            "lots",
                            "of",
                            "buttons",
                            "even",
                            "an",
                            "",
                            "empty",
                            "one",
                        ]}
                        data={data}
                    />
                ),
            mockUseState
        ).render();
        buttons = wrapper.find("button");
        expect(buttons).toHaveLength(8);
        for (let i = 0; i < 8; ++i) {
            expect(buttons.at(i).text()).toEqual(
                ["lots", "of", "buttons", "even", "an", "", "empty", "one"][i]
            );
        }

        wrapper = new StatefulMock(
            () =>
                shallow(
                    <MultipleChoice prompt="Prompt" choices={[]} data={data} />
                ),
            mockUseState
        ).render();
        buttons = wrapper.find("button");
        expect(buttons).toHaveLength(0);
    });
    it('determines selected button from "data" prop', () => {
        let wrapper = new StatefulMock(
            () =>
                shallow(
                    <MultipleChoice
                        prompt="Prompt"
                        choices={["one", "two", "three"]}
                        data={{}}
                    />
                ),
            mockUseState
        ).render();
        expect(wrapper.find(".selected")).toHaveLength(0);

        wrapper = new StatefulMock(
            () =>
                shallow(
                    <MultipleChoice
                        prompt="Prompt"
                        choices={["one", "two", "three"]}
                        data={{ response: "one" }}
                    />
                ),
            mockUseState
        ).render();
        expect(wrapper.find(".selected")).toHaveLength(1);
        expect(wrapper.find("button").at(0).hasClass("selected")).toBe(true);

        wrapper = new StatefulMock(
            () =>
                shallow(
                    <MultipleChoice
                        prompt="Prompt"
                        choices={["one", "two", "three"]}
                        data={{ response: "two" }}
                    />
                ),
            mockUseState
        ).render();
        expect(wrapper.find(".selected")).toHaveLength(1);
        expect(wrapper.find("button").at(1).hasClass("selected")).toBe(true);
    });
    it('relays first button selection through "data" prop', () => {
        let wrapper = new StatefulMock(
            () =>
                shallow(
                    <MultipleChoice
                        prompt="Prompt"
                        choices={["one", "two", "three"]}
                        data={data}
                    />
                ),
            mockUseState
        ).render();
        wrapper.find("button").at(0).simulate("click");
        expect(data).toEqual({
            complete: true,
            response: "one",
        });
    });
    it('relays replaced button selection through "data" prop', () => {
        let wrapper = new StatefulMock(
            () =>
                shallow(
                    <MultipleChoice
                        prompt="Prompt"
                        choices={["one", "two", "three"]}
                        data={data}
                    />
                ),
            mockUseState
        ).render();
        wrapper.find("button").at(0).simulate("click");
        expect(data).toEqual({
            complete: true,
            response: "one",
        });
        wrapper.find("button").at(2).simulate("click");
        expect(data).toEqual({
            complete: true,
            response: "three",
        });
        wrapper.find("button").at(1).simulate("click");
        expect(data).toEqual({
            complete: true,
            response: "two",
        });
        wrapper.find("button").at(0).simulate("click");
        expect(data).toEqual({
            complete: true,
            response: "one",
        });
    });
    it('includes a checkbox iff prop "required" is set to "opt-out"', () => {
        let wrapper = new StatefulMock(
            () =>
                shallow(
                    <MultipleChoice
                        required="opt-out"
                        prompt="Prompt."
                        choices={["one"]}
                        data={data}
                    />
                ),
            mockUseState
        ).render();
        expect(wrapper.find("SkipCheckbox")).toHaveLength(1);
        wrapper = new StatefulMock(
            () =>
                shallow(
                    <MultipleChoice
                        required={true}
                        prompt="Prompt."
                        choices={["one"]}
                        data={data}
                    />
                ),
            mockUseState
        ).render();
        expect(wrapper.find("SkipCheckbox")).toHaveLength(0);
        wrapper = new StatefulMock(
            () =>
                shallow(
                    <MultipleChoice
                        required={false}
                        prompt="Prompt."
                        choices={["one"]}
                        data={data}
                    />
                ),
            mockUseState
        ).render();
        expect(wrapper.find("SkipCheckbox")).toHaveLength(0);
    });
    it('relays opt-out checkbox selection through "data" prop', () => {
        let wrapper = new StatefulMock(
            () =>
                mount(
                    <MultipleChoice
                        prompt="Prompt"
                        choices={["one", "two", "three"]}
                        data={data}
                        required="opt-out"
                    />
                ),
            mockUseState
        ).render();
        let buttons = wrapper.find("button");
        let checkbox = wrapper.find("SkipCheckbox").find("input");

        buttons.at(0).simulate("click");
        expect(data).toEqual({
            complete: true,
            response: "one",
        });
        checkbox.simulate("click", { target: { checked: true } });
        expect(data).toEqual({
            complete: "opt-out",
            response: "",
        });
        buttons.at(1).simulate("click");
        expect(data).toEqual({
            complete: true,
            response: "two",
        });
        checkbox.simulate("click", { target: { checked: true } });
        expect(data).toEqual({
            complete: "opt-out",
            response: "",
        });
        checkbox.simulate("click", { target: { checked: false } });
        expect(data).toEqual({
            complete: false,
            response: "",
        });
        buttons.at(1).simulate("click");
        expect(data).toEqual({
            complete: true,
            response: "two",
        });
    });
    it("sets initial data", () => {
        new StatefulMock(
            () =>
                mount(
                    <MultipleChoice
                        prompt="Prompt"
                        choices={["one", "two", "three"]}
                        data={data}
                        required={false}
                    />
                ),
            mockUseState
        ).render();
        expect(data).toEqual({
            complete: true,
            response: "",
        });

        data = {};
        new StatefulMock(
            () =>
                mount(
                    <MultipleChoice
                        prompt="Prompt"
                        choices={["one", "two", "three"]}
                        data={data}
                        required={true}
                    />
                ),
            mockUseState
        ).render();
        expect(data).toEqual({
            complete: false,
            response: "",
        });

        data = {};
        new StatefulMock(
            () =>
                mount(
                    <MultipleChoice
                        prompt="Prompt"
                        choices={["one", "two", "three"]}
                        data={data}
                        required="opt-out"
                    />
                ),
            mockUseState
        ).render();
        expect(data).toEqual({
            complete: false,
            response: "",
        });
    });
    it("does not overwrite existing data", () => {
        data = {
            complete: true,
            response: "two",
        };
        new StatefulMock(
            () =>
                mount(
                    <MultipleChoice
                        prompt="Prompt"
                        choices={["one", "two", "three"]}
                        data={data}
                        required={false}
                    />
                ),
            mockUseState
        ).render();
        expect(data).toEqual({
            complete: true,
            response: "two",
        });

        data = {
            complete: true,
            response: "two",
        };
        new StatefulMock(
            () =>
                mount(
                    <MultipleChoice
                        prompt="Prompt"
                        choices={["one", "two", "three"]}
                        data={data}
                        required={true}
                    />
                ),
            mockUseState
        ).render();
        expect(data).toEqual({
            complete: true,
            response: "two",
        });

        data = {
            complete: true,
            response: "two",
        };
        new StatefulMock(
            () =>
                mount(
                    <MultipleChoice
                        prompt="Prompt"
                        choices={["one", "two", "three"]}
                        data={data}
                        required="opt-out"
                    />
                ),
            mockUseState
        ).render();
        expect(data).toEqual({
            complete: true,
            response: "two",
        });
    });
    it("keeps button selection state", () => {
        let stateful = new StatefulMock(
            () =>
                mount(
                    <MultipleChoice
                        prompt="Prompt."
                        choices={["one", "two", "three"]}
                        data={data}
                        required="opt-out"
                    />
                ),
            mockUseState
        );
        let wrapper = stateful.render();

        expect(wrapper.find(".selected")).toHaveLength(0);
        wrapper.find("button").at(0).simulate("click");
        wrapper = stateful.render();
        expect(wrapper.find("button").at(0).hasClass("selected")).toBe(true);
        expect(wrapper.find(".selected")).toHaveLength(1);

        wrapper.find("button").at(2).simulate("click");
        wrapper = stateful.render();
        expect(wrapper.find("button").at(2).hasClass("selected")).toBe(true);
        expect(wrapper.find(".selected")).toHaveLength(1);

        wrapper
            .find("SkipCheckbox")
            .find("input")
            .simulate("click", { target: { checked: true } });
        wrapper = stateful.render();
        expect(wrapper.find(".selected")).toHaveLength(0);

        wrapper
            .find("SkipCheckbox")
            .find("input")
            .simulate("click", { target: { checked: false } });
        wrapper = stateful.render();
        expect(wrapper.find(".selected")).toHaveLength(0);

        wrapper.find("button").at(1).simulate("click");
        wrapper = stateful.render();
        expect(wrapper.find("button").at(1).hasClass("selected")).toBe(true);
        expect(wrapper.find(".selected")).toHaveLength(1);

        wrapper
            .find("SkipCheckbox")
            .find("input")
            .simulate("click", { target: { checked: true } });
        wrapper = stateful.render();
        expect(wrapper.find(".selected")).toHaveLength(0);

        wrapper.find("button").at(1).simulate("click");
        wrapper = stateful.render();
        expect(wrapper.find("button").at(1).hasClass("selected")).toBe(true);
        expect(wrapper.find(".selected")).toHaveLength(1);
    });
});
