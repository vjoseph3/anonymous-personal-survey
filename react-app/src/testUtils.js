// this module provides testing accessories
//   such as stateful component mocking

class StatefulMock {
    /**
     * @param {Function} renderCallback a function to render the stateful components
     * @param {Function} mockUseState a current jest.fn() mock of React.useState; will be overwritten
     */
    constructor(renderCallback, mockUseState) {
        this.renderCallback = renderCallback;
        this.mockUseState = mockUseState;

        this.states = [];
        this.countRenderedStates = 0;

        const mockThis = this;
        mockUseState.mockImplementation((initState) => {
            // successive calls to useState should create different states,
            //   stored at successive indices in an array of states
            const stateIndex = mockThis.countRenderedStates;
            let state = initState;
            if (mockThis.states.length > stateIndex) {
                // if state exists, use existing state
                state = mockThis.states[stateIndex];
            } else {
                mockThis.states.push(state);
            }
            const setState = (newState) => {
                mockThis.states[stateIndex] = newState;
            };
            return [state, setState];
        });
    }

    render() {
        // reset the state counter to re-use existing states
        this.countRenderedStates = 0;
        return this.renderCallback();
    }
}

export { StatefulMock };
