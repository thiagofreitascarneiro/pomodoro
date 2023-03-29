import {HandPalm, Play } from 'phosphor-react';
import {  
        HomeContainer,   
        
        StartCountdownButton, 
        StopCountdownButton, 
    } from './styles';
import { useContext } from 'react';

import { NewCycleForm } from './components/NewCycleForm';
import { Countdown } from './components/Countdown';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { FormProvider, useForm } from 'react-hook-form';
import { CyclesContext } from '../../contexts/CyclesContext';



const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, 'Informe a tarefa'),
    minutesAmount: zod.number().min(5, 'o intervalo precisa ser de no minimo de 5 mniutos.')
    .max(60, 'o intervalo precisa ser de no máximo de 60 mniutos.'),
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export function Home() {
    const { activeCycle, createNewCycle, interruptCurrentCycle} = useContext(CyclesContext)
    
    const newCycleForm = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0,
        }
    });
    
    const { handleSubmit, watch, reset} = newCycleForm;

    function handleCreateNewCycle(data: NewCycleFormData) {
        createNewCycle(data)
        reset()
    }

    const task = watch('task')
    const isSubmitDisabled = !task


    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)}  action=""> 
                <FormProvider  {...newCycleForm}>
                    <NewCycleForm />
                </FormProvider>
                
                <Countdown />
                
               { activeCycle ? (
                 <StopCountdownButton onClick={interruptCurrentCycle} type="button">
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
