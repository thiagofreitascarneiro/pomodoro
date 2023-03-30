import { ReactNode, createContext, useEffect, useReducer, useState } from "react";
import { Cycle, cyclesReducer } from "../reducers/cycles/reducer";
import { ActionTypes, addNewCycleAction, interruptCurrentCycleAction, markCurrentCycleAsFinishedAction } from "../reducers/cycles/actions";
import { differenceInSeconds } from "date-fns";

interface CreateCycleData {
    task: string;
    minutesAmount: number;
}

interface CyclesContextType {
    cycles: Cycle[];
    activeCycle: Cycle | undefined;
    activeCycleId: string | null;
    amountsSecondsPassed: number;
    markCurrentCycleAsFinished: () => void;
    setSecondsPassed:(seconds: number) => void;
    createNewCycle: (data: CreateCycleData) => void;
    interruptCurrentCycle: () => void;
}

export const CyclesContext = createContext({} as CyclesContextType);

interface CyclesContextProviderProps {
    children: ReactNode;
}

export function CyclesContextProvider({ children }:CyclesContextProviderProps) {

    const [cyclesState, dispatch] = useReducer(cyclesReducer,
        {
        cycles: [],
        activeCycleId: null,
    }, () => {
        const storedStateAsJSON = localStorage.getIetem(
            '@ignite-timer:cycles-state-1.0.0',
            )
        if (storedStateAsJSON) {
            return JSON.parse(storedStateAsJSON)
        }
    })

    const { cycles, activeCycleId } = cyclesState;
    const activeCycle = cycles.find((cycle: any) => cycle.id === activeCycleId);

    const [amountsSecondsPassed, setAmountsSecondsPassed] = useState(() => {
       if (activeCycle) {
            return differenceInSeconds(new Date(), 
            new Date(activeCycle.startDate))
       }
        return 0
    });

    useEffect(() => {
        const stateJson = JSON.stringify(cyclesState);

        localStorage.setItem('@iginte-time:cycle-state-1.0.0', stateJson);
    }, [cyclesState])
    

    function setSecondsPassed(seconds: number) {
        setAmountsSecondsPassed(seconds)
    }

    function markCurrentCycleAsFinished() {
        dispatch(markCurrentCycleAsFinishedAction()); 
    }   

    function createNewCycle(data: CreateCycleData) {
        const id =  String( new Date().getTime())

        const newCycle: Cycle = {
            id: id,
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        }

        dispatch(addNewCycleAction(newCycle));

        
        setAmountsSecondsPassed(0);
    }

    function interruptCurrentCycle() {

        dispatch(interruptCurrentCycleAction());
        
    }


    return (
        <CyclesContext.Provider 
        value={{
            cycles,
            activeCycle, 
            activeCycleId, 
            markCurrentCycleAsFinished,
            amountsSecondsPassed,
            setSecondsPassed,
            createNewCycle,
            interruptCurrentCycle,
            
        }}>
            {children}
        </CyclesContext.Provider>
    )
}