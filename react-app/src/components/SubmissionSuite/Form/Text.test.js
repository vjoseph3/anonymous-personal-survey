import { mount, shallow } from "enzyme";
import toJson from "enzyme-to-json";
import { StatefulMock } from "../../../testUtils";
import Text from "./Text";

describe("<Text />", () => {
    let data;
    beforeEach(() => {
        data = {};
    });
    it("renders the prompt", () => {
        let wrapper = shallow(<Text data={data} prompt="This is a prompt." />);
        let p = wrapper.find("p");
        expect(p).toHaveLength(1);
        expect(p.text()).toEqual("This is a prompt.");

        wrapper = shallow(
            <Text data={data} prompt="This is a different prompt." />
        );
        p = wrapper.find("p");
        expect(p).toHaveLength(1);
        expect(p.text()).toEqual("This is a different prompt.");
    });
    it("renders an input field", () => {
        let wrapper = shallow(<Text data={data} prompt="Prompt." />);
        expect(wrapper.find("textarea")).toHaveLength(1);
    });
    it('determines input field initial text contents from "data" prop', () => {
        let wrapper = shallow(<Text data={{}} prompt="Prompt." />);
        expect(wrapper.find("textarea").props().value).toBe(undefined);

        wrapper = shallow(<Text data={{ response: "" }} prompt="Prompt." />);
        expect(wrapper.find("textarea").props().value).toBe("");

        wrapper = shallow(
            <Text data={{ response: "Hello Summer" }} prompt="Prompt." />
        );
        expect(wrapper.find("textarea").props().value).toBe("Hello Summer");
    });
    it('relays text input through "data" prop', () => {
        const data = {};
        let wrapper = shallow(
            <Text data={data} required={true} prompt="Prompt." />
        );
        let textarea = wrapper.find("textarea");

        textarea.simulate("change", { target: { value: "This is input." } });
        expect(data).toEqual({
            complete: true,
            response: "This is input.",
        });

        textarea.simulate("change", {
            target: { value: "This is other input." },
        });
        expect(data).toEqual({
            complete: true,
            response: "This is other input.",
        });

        textarea.simulate("change", { target: { value: "" } });
        expect(data).toEqual({
            complete: false,
            response: "",
        });

        textarea.simulate("change", { target: { value: "This is input." } });
        expect(data).toEqual({
            complete: true,
            response: "This is input.",
        });
    });
    it('includes a checkbox iff prop "required" is set to "opt-out"', () => {
        let wrapper = shallow(
            <Text data={data} required="opt-out" prompt="Prompt." />
        );
        expect(wrapper.find("SkipCheckbox")).toHaveLength(1);
        wrapper = shallow(
            <Text data={data} required={true} prompt="Prompt." />
        );
        expect(wrapper.find("SkipCheckbox")).toHaveLength(0);
        wrapper = shallow(
            <Text data={data} required={false} prompt="Prompt." />
        );
        expect(wrapper.find("SkipCheckbox")).toHaveLength(0);
    });
    it('relays opt-out checkbox actions through "data" prop', () => {
        let data = {};
        let wrapper = mount(
            <Text data={data} required="opt-out" prompt="Prompt." />
        );
        let textarea = wrapper.find("textarea");
        let checkbox = wrapper.find("SkipCheckbox").find("input");

        checkbox.simulate("click", { target: { checked: true } });
        expect(data).toEqual({
            complete: "opt-out",
            response: "",
        });

        textarea.simulate("change", { target: { value: "This is input." } });
        expect(data).toEqual({
            complete: true,
            response: "This is input.",
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
    });
    it("sets initial data", () => {
        let data = {};
        mount(<Text data={data} required={false} />);
        expect(data).toEqual({
            complete: true,
            response: "",
        });

        data = {};
        mount(<Text data={data} required={true} />);
        expect(data).toEqual({
            complete: false,
            response: "",
        });

        data = {};
        mount(<Text data={data} required="opt-out" />);
        expect(data).toEqual({
            complete: false,
            response: "",
        });
    });
    it("does not overwrite existing data", () => {
        let data = {
            complete: true,
            response: "This is a response.",
        };
        mount(<Text data={data} required={false} />);
        expect(data).toEqual({
            complete: true,
            response: "This is a response.",
        });

        data = {
            complete: true,
            response: "This is a response.",
        };
        mount(<Text data={data} required={true} />);
        expect(data).toEqual({
            complete: true,
            response: "This is a response.",
        });

        data = {
            complete: true,
            response: "This is a response.",
        };
        mount(<Text data={data} required="opt-out" />);
        expect(data).toEqual({
            complete: true,
            response: "This is a response.",
        });
    });
    it('allows empty response iff prop "required" is set to false', () => {
        let data = {};
        let wrapper = mount(<Text data={data} required={false} />);
        expect(data).toEqual({
            complete: true,
            response: "",
        });
        wrapper
            .find("textarea")
            .simulate("change", { target: { value: "Hello" } });
        expect(data).toEqual({
            complete: true,
            response: "Hello",
        });
        wrapper.find("textarea").simulate("change", { target: { value: "" } });
        expect(data).toEqual({
            complete: true,
            response: "",
        });

        data = {};
        wrapper = mount(<Text data={data} required={true} />);
        wrapper
            .find("textarea")
            .simulate("change", { target: { value: "Hello" } });
        expect(data).toEqual({
            complete: true,
            response: "Hello",
        });
        wrapper.find("textarea").simulate("change", { target: { value: "" } });
        expect(data).toEqual({
            complete: false,
            response: "",
        });

        data = {};
        wrapper = mount(<Text data={data} required="opt-out" />);
        let textarea = wrapper.find("textarea");
        let checkbox = wrapper.find("SkipCheckbox").find("input");

        textarea.simulate("change", { target: { value: "Hello" } });
        expect(data).toEqual({
            complete: true,
            response: "Hello",
        });
        textarea.simulate("change", { target: { value: "" } });
        expect(data).toEqual({
            complete: false,
            response: "",
        });
        textarea.simulate("change", { target: { value: "This is input." } });
        expect(data).toEqual({
            complete: true,
            response: "This is input.",
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
    });
});
