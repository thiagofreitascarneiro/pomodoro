import {HandPalm, Play } from 'phosphor-react';
import {  
        HomeContainer,   
        
        StartCountdownButton, 
        StopCountdownButton, 
    } from './styles';
import { createContext, useEffect, useState } from 'react';
import { differenceInSeconds } from 'date-fns';
import { NewCycleForm } from './components/NewCycleForm';
import { Countdown } from './components/Countdown';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { FormProvider, useForm } from 'react-hook-form';


interface Cycle {
    id: string;
    task: string;
    minutesAmount: number;
    startDate: Date;
    interruptedDate?: Date;
    finishedDate?: Date;
}

interface CyclesContextType {
    activeCycle: Cycle | undefined;
    activeCycleId: string | null;
    amountsSecondsPassed: number;
    markCurrentCycleAsFinished: () => void;
    setSecondsPassed:(seconds: number) => void;
}

export const CyclesContext = createContext({} as CyclesContextType);

const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, 'Informe a tarefa'),
    minutesAmount: zod.number().min(5, 'o intervalo precisa ser de no minimo de 5 mniutos.')
    .max(60, 'o intervalo precisa ser de no máximo de 60 mniutos.'),
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export function Home() {

    const [cycles, setCycles] = useState<Cycle[]>([]);
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null);

    const newCycleForm = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0,
        }
    });
    
    const { handleSubmit, watch, reset} = newCycleForm

    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

    function setSecondsPassed(seconds: number) {
        setAmountsSecondsPassed(seconds)
    }

    const [amountsSecondsPassed, setAmountsSecondsPassed] = useState(0);

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
     

    function handleCreateNewCycle(data: NewCycleFormData) {
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

        reset();
    }

    function handleInterruptCycle() {
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


    const task = watch('task')
    const isSubmitDisabled = !task


    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)}  action=""> 
                <CyclesContext.Provider 
                value={{
                    activeCycle, 
                    activeCycleId, 
                    markCurrentCycleAsFinished,
                    amountsSecondsPassed,
                    setSecondsPassed
                }}
                >
                    <FormProvider  {...newCycleForm}>
                        <NewCycleForm />
                    </FormProvider>
                    
                    <Countdown />
                </CyclesContext.Provider>
               

               { activeCycle ? (
                 <StopCountdownButton onClick={handleInterruptCycle} type="button">
                    <HandPalm size={24} />
                    Interromper
                </StopCountdownButton>
               ): (
                <StartCountdownButton disabled={isSubmitDisabled} type="submit">
                    <Play size={24} />
                    Começar
                </StartCountdownButton>
               )}
            </form>
        </HomeContainer>
    )
}
