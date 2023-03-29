import { ReactNode, createContext, useState } from "react";

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

interface Cycle {
    id: string;
    task: string;
    minutesAmount: number;
    startDate: Date;
    interruptedDate?: Date;
    finishedDate?: Date;
}

export const CyclesContext = createContext({} as CyclesContextType);

interface CyclesContextProviderProps {
    children: ReactNode;
}

export function CyclesContextProvider({ children }:CyclesContextProviderProps) {

    const [cycles, setCycles] = useState<Cycle[]>([]);
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
    const [amountsSecondsPassed, setAmountsSecondsPassed] = useState(0);

    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

    function setSecondsPassed(seconds: number) {
        setAmountsSecondsPassed(seconds)
    }

    function markCurrentCycleAsFinished() {
        setCycles((state) => state.map((cycle) => {
            if (cycle.id === activeCycleId) {
                return {
                  ...cycle,
                    interruptedDate: new Date() }
            } else {
                return cycle;
            }
            }),
        )
    }   

    function createNewCycle(data: CreateCycleData) {
        const id =  String( new Date().getTime())

        const newCycle: Cycle = {
            id: id,
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        }

        setCycles((state) => [...state, newCycle]);
        setActiveCycleId(id);
        setAmountsSecondsPassed(0);

        // reset();
    }

    function interruptCurrentCycle() {
        setCycles((state) => state.map((cycle) => {
            if (cycle.id === activeCycleId) {
                return {
                  ...cycle,
                    interruptedDate: new Date() }
            } else {
                return cycle;
            }
        }),
        )
        setActiveCycleId(null);
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