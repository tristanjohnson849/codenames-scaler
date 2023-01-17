import { Dispatch, SetStateAction, useEffect, useRef } from "react";

/*
converts a dispatch on T to a dispatch on S
bidirectional mapping required for function actions
example:
```
const ExampleComponent = () => {
    const DEFAULT_CHAR = 'a';
    const [myChars, setMyChars] = useState('');

    // this function will now set the myChars state to 'a' repeated n times
    const setCharsByLength = transformAndSetState(
        (length) => DEFAULT_CHAR.repeat(length),
        (chars) => chars.length,
        setMyChars
    )
    return (
        <div>
            <h1>{myChars}</h1>
            <input 
                type="number" 
                value={myChars.length} 
                onChange={(e) => setCharsByLength(e.target.value)}
            />
            <button onClick={setCharsByLength((prevLength) => prevLength + 1)}>Add Char</button>
        </div>
    );
}
```
*/
export function transformAndDispatch<S, T>(
    forward: (s: S) => T, 
    backward: (t: T) => S, 
    dispatch: Dispatch<SetStateAction<T>>
): Dispatch<SetStateAction<S>> {
    return (action: SetStateAction<S>) => isFunctionAction(action) 
        ? dispatch((t: T) => forward(action(backward(t))))
        : dispatch(forward(action))
};

export function isFunctionAction<S>(action: SetStateAction<S>): action is (newState: S) => S {
    return typeof action === 'function';
}

export function usePrevious<T>(value: T): T | null {
    const ref = useRef<T | null>(null);
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}
