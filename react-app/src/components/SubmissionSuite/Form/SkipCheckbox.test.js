import { mount, shallow } from "enzyme";
import toJson from "enzyme-to-json";
import { StatefulMock } from "../../../testUtils";
import SkipCheckbox from "./SkipCheckbox";

const mockSetSkipping = jest.fn();

describe("<SkipCheckbox />", () => {
    beforeEach(() => {
        mockSetSkipping.mockClear();
    });
    it("renders the label", () => {
        let wrapper = shallow(<SkipCheckbox />);
        let label = wrapper.find("label");
        expect(label).toHaveLength(1);
        expect(label.text()).toEqual("Skip this question");
    });
    it("renders the checkbox", () => {
        let wrapper = shallow(<SkipCheckbox />);
        expect(wrapper.find("input")).toHaveLength(1);
    });
    it('determines default checked or not by prop "skipping"', () => {
        let wrapper = shallow(<SkipCheckbox skipping={true} />);
        expect(wrapper.find("input").props().defaultChecked).toBe(true);

        wrapper = shallow(<SkipCheckbox skipping={false} />);
        expect(wrapper.find("input").props().defaultChecked).toBe(false);
    });
    it('relays checkbox action through the prop function "setSkipping"', () => {
        let wrapper = shallow(<SkipCheckbox setSkipping={mockSetSkipping} />);
        wrapper.find("input").simulate("click", { target: { checked: true } });
        expect(mockSetSkipping.mock.calls[0][0]).toBe(true);
        wrapper.find("input").simulate("click", { target: { checked: false } });
        expect(mockSetSkipping.mock.calls[1][0]).toBe(false);
    });
});
