import { mount, shallow } from "enzyme";
import toJson from "enzyme-to-json";
import { StatefulMock } from "../../testUtils";

const mockUseState = jest.fn().mockImplementation((state) => {
    return [state, () => {}];
});
jest.mock("react", () => ({
    ...jest.requireActual("react"),
    useState: (state) => mockUseState(state),
}));

const MultipleChoice = (props) => <div props={props} />;
jest.mock(
    "./Form/MultipleChoice",
    () => ({
        __esModule: true,
        default: MultipleChoice,
    }),
    { virtual: true }
);
const Text = (props) => <div props={props} />;
jest.mock(
    "./Form/Text",
    () => ({
        __esModule: true,
        default: Text,
    }),
    { virtual: true }
);

describe("<Form />", () => {
    let Form;
    let wrapper;
    describe("Interpretation of survey.json", () => {
        it("correctly renders a multiple choice question", () => {
            jest.resetModules();
            jest.mock(
                "../../survey.json",
                () => [
                    {
                        component: "MultipleChoice",
                        props: {
                            prompt: "This is a multiple choice question.",
                            choices: ["one", "two", "three"],
                        },
                    },
                ],
                { virtual: true }
            );
            Form = require("./Form").default;
            wrapper = new StatefulMock(
                () => shallow(<Form />),
                mockUseState
            ).render();
            expect(wrapper.find(MultipleChoice)).toHaveLength(1);
        });
        it("correctly renders a text answer question", () => {
            jest.resetModules();
            jest.mock(
                "../../survey.json",
                () => [
                    {
                        component: "Text",
                        props: {
                            prompt: "This is a text answer question.",
                        },
                    },
                ],
                { virtual: true }
            );
            Form = require("./Form").default;
            wrapper = new StatefulMock(
                () => shallow(<Form />),
                mockUseState
            ).render();
            expect(wrapper.find(Text)).toHaveLength(1);
        });
        it("correctly renders different and duplicate questions in order", () => {
            jest.resetModules();
            jest.mock(
                "../../survey.json",
                () => [
                    {
                        component: "Text",
                        props: {
                            prompt: "This is a text answer question.",
                        },
                    },
                    {
                        component: "MultipleChoice",
                        props: {
                            prompt: "This is a multiple choice question.",
                            choices: ["one", "two", "three"],
                        },
                    },
                    {
                        component: "MultipleChoice",
                        props: {
                            prompt: "This is a multiple choice question.",
                            choices: ["one", "two", "three"],
                        },
                    },
                    {
                        component: "Text",
                        props: {
                            prompt: "This is a second text answer question.",
                        },
                    },
                    {
                        component: "Text",
                        props: {
                            prompt: "This is a third text answer question.",
                        },
                    },
                    {
                        component: "MultipleChoice",
                        props: {
                            prompt: "This is a new multiple choice question.",
                            choices: ["nice"],
                        },
                    },
                    {
                        component: "MultipleChoice",
                        props: {
                            prompt: "C'est une autre question à choix multiples.",
                            choices: ["un", "deux", "trois", "quatre"],
                        },
                    },
                ],
                { virtual: true }
            );
            Form = require("./Form").default;
            wrapper = new StatefulMock(
                () => shallow(<Form />),
                mockUseState
            ).render();
            expect(wrapper.find(MultipleChoice)).toHaveLength(4);
            expect(wrapper.find(Text)).toHaveLength(3);
            expect(toJson(wrapper)).toMatchSnapshot();
        });
    });
    describe("Basic page layout", () => {
        beforeAll(() => {
            jest.resetModules();
            jest.mock(
                "../../survey.json",
                () => [
                    {
                        component: "Text",
                        props: {
                            prompt: "This is a text question.",
                        },
                    },
                    {
                        component: "MultipleChoice",
                        props: {
                            prompt: "This is a multiple choice question.",
                            choices: ["one", "two", "three"],
                        },
                    },
                ],
                { virtual: true }
            );
            Form = require("./Form").default;
            wrapper = new StatefulMock(
                () => shallow(<Form />),
                mockUseState
            ).render();
        });
        it("matches the snapshot", () => {
            expect(toJson(wrapper)).toMatchSnapshot();
        });
        it("renders a Submit button and a Submit Anonymously button", () => {
            expect(wrapper.find("SubmitButton")).toHaveLength(1);
            expect(wrapper.find("SubmitAnonButton")).toHaveLength(1);
        });
    });
    describe("State management", () => {
        let stateful;
        let text;
        let mc;
        beforeEach(() => {
            jest.resetModules();
            jest.mock(
                "../../survey.json",
                () => [
                    {
                        component: "Text",
                        props: {
                            prompt: "This is a text question.",
                        },
                    },
                    {
                        component: "MultipleChoice",
                        props: {
                            prompt: "This is a multiple choice question.",
                            choices: ["one", "two", "three"],
                        },
                    },
                ],
                { virtual: true }
            );
            Form = require("./Form").default;
            stateful = new StatefulMock(() => mount(<Form />), mockUseState);
            wrapper = stateful.render();
            text = wrapper.find(Text);
            mc = wrapper.find(MultipleChoice);
        });
        it("provides each question component with a data prop", () => {
            expect(text.prop("data")).toEqual({});
            expect(mc.prop("data")).toEqual({});
        });
        it("provides each question component with a setData() prop", () => {
            expect(typeof text.prop("setData")).toEqual("function");
            expect(typeof mc.prop("setData")).toEqual("function");
        });
        it("activates Submit buttons when all required questions are answered", () => {
            text.props().setData({
                complete: true,
                response: "Here's the answer.",
            });
            wrapper = stateful.render();
            expect(stateful.states[0]).toEqual([
                { complete: true, response: "Here's the answer." },
                {},
            ]);
            expect(wrapper.find("SubmitButton").props().active).toBeFalsy();
            expect(wrapper.find("SubmitAnonButton").props().active).toBeFalsy();

            mc.props().setData({ complete: true, choice: "one" });
            wrapper = stateful.render();
            expect(stateful.states[0]).toEqual([
                { complete: true, response: "Here's the answer." },
                { complete: true, choice: "one" },
            ]);
            expect(wrapper.find("SubmitButton").props().active).toBeTruthy();
            expect(
                wrapper.find("SubmitAnonButton").props().active
            ).toBeTruthy();

            text.props().setData({ complete: false });
            wrapper = stateful.render();
            expect(stateful.states[0]).toEqual([
                { complete: false },
                { complete: true, choice: "one" },
            ]);
            expect(wrapper.find("SubmitButton").props().active).toBeFalsy();
            expect(wrapper.find("SubmitAnonButton").props().active).toBeFalsy();
        });
    });
});
