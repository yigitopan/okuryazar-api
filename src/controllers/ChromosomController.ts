import fs from 'fs'
import { erstellenOderAktualiserenGerichteJson } from "../controllers/DateiController";
import { Chromosom } from "../models/Chromosom";
import { Gericht } from "../models/Gericht";
import { getFoodList } from '../controllers/DateiController';


export class ChromosomController {
    private finalGerichte!: Gericht[]
    private finalMengen!: number[]
    private mean!: number;
    private elite!: Chromosom;
    private gerichte!: Gericht[];
    private anzahlDerPopulation!: number;
    private laengeDerChromosomen!: number;
    private dieBeste: Chromosom[] = [];
    private results: number[] = []
    private means: number[] = []
    constructor(
        public LBM: number, // Bekommen wir LBM und Kalorien in der Konstruktor, um diese Werte in den Funktionen zu nutzen
        public taeglicheKalorien: number,
        ){
            this.LBM = LBM,
            this.taeglicheKalorien = taeglicheKalorien
        }
        
    private populationInitialisieren = (anzahlDerIndividuellen: number) => {
        let neuePopulation: Chromosom[] = [];
        this.gerichte = getFoodList(); 
        
        // Speichern es als LDC, damit wir es nach der for-Schleife wieder auf laengeDesChromosoms stellen.
        for (let index = 0; index < anzahlDerIndividuellen; index++) { 

            this.laengeDerChromosomen = this.gerichte.length-5124
            let ldcTemp = this.laengeDerChromosomen;

            let individuell = new Array(this.laengeDerChromosomen).fill(0)

            const mengen: number[] = [];
            const zufaelligeGerichte: Gericht[] = [];
                                  // Anzahl der Gerichte in JSON
            // Es gibt 5624 Gerichte in JSON. Für jedes Chromosom, fügen wir eine vorbestimmte Menge(nun 10) von Gerichten hinzu.
            // Mit dieser While LDC beginnt mit dem Wert 9.
            while (ldcTemp--) {
                var x = Math.random();   // Zufällige Nummer Zwischen 0 und "laenge"

                if(x<0.5) {
                    individuell[x] = 1;
                }
            }

            let chromosom: Chromosom = new Chromosom(individuell)
            neuePopulation.push(chromosom);
        }
        let bestesChromosom = neuePopulation.reduce((min, bCh) => min.fitness < bCh.fitness ? min : bCh);
        this.elite = bestesChromosom;

        return neuePopulation;
    }
    
    private fitnessEvaluation = (chromosom: Chromosom): number => {
        let gesamtProtein: number = 0;
        let gesamtFett: number = 0;
        let gesamtKohlenhydrat: number = 0;
      
        // Für jedes Gericht 
        
        chromosom.gerichte.forEach((gen,i) => {
            if(gen!= 0) {
                const gericht = this.gerichte[i];
                gesamtProtein += gericht.protein
                gesamtFett += gericht.fett
                gesamtKohlenhydrat += gericht.karb

            }
        });

        // Gesamte Kalorien von Fett und Protein (Damit wir die restliche auf Kohlenhydrat verteilen können.)
        const proteinKalorien = gesamtProtein * 4;
        const fettKalorien = gesamtFett * 9;
      
        // Gesamte Kalorien von Kohlenhydraten
        const kohlenhydratKalorien = gesamtKohlenhydrat * 4;
    
        // Gesamte Kalorien für alle Zutaten
        const gesamtKalorien = kohlenhydratKalorien + proteinKalorien + fettKalorien;
      
        //Ziele, die bei der Studie überrichtet wurden - Basiert auf LBM
        const zielProtein = this.LBM * 2.5
        const zielFett = this.LBM * 0.75;
      
        // Klassisch SSE
        const proteinUnterschied = gesamtProtein - zielProtein;
        const fettUnterschied = gesamtFett - zielFett;
        const kalorienUnterschied = gesamtKalorien - this.taeglicheKalorien;
      
        const proteinFitness = proteinUnterschied ** 2;
        const fettFitness = fettUnterschied ** 2;
        const kalorienFitness = kalorienUnterschied ** 2;
    
        let gesamtFitness = (kalorienFitness+proteinFitness+fettFitness);

        if(gesamtKalorien>this.taeglicheKalorien) {
            gesamtFitness = gesamtFitness + 5000;
        }
        
        chromosom.setFitness(gesamtFitness);
    
        return gesamtFitness;
    }

    private tournamentSelektion(population: Chromosom[], tournamentGroesse: number) {
        let index= 0;

        const eltern: Chromosom[] = [];
        let anzahlDerTournaments = population.length / tournamentGroesse; // Jedes Tournament hat einen Gewinner
        while (anzahlDerTournaments > 0) {
            let tournament: Chromosom[] = []

            for (let i = 0; i < tournamentGroesse; i++) {   // Hol Chromosomen zufällig genug, um die tournamentGroesse zu erreichen
                tournament.push(population[index]);
                index++;
            }

            const fittesten = tournament.reduce(function(prev, current) {
                return (prev.fitness < current.fitness) ? prev : current  // Survival of the Fittest
            })

            eltern.push(fittesten);                                      // Der Fitteste wird eine Eltern
            anzahlDerTournaments--;
        }

        return eltern;
    }

    private crossover(parents: Chromosom[]) {

        parents.sort(() => 0.5 - Math.random()); // NICHT SICHER
        let totalFitness = 0;

        const kinder: Chromosom[] = [];
        const crossoverPunkt =  Math.floor(Math.random() * this.laengeDerChromosomen)
        //Diese Funktion ist selbstverständlich
        for (let i = 0; i < parents.length-1; i++) {
            // Jedes Chromosom wird 2 mal benutzt, außer der Erste(1) und Letzte(1). Wir benutzen diese zwei um es zu kompansieren
            if(i==0){
                const random = Math.random();
                if(random<0.9) {
                    const g_ersteE_ersteH: number[] = parents[i].gerichte.slice(0,crossoverPunkt)
                    const g_ersteE_zweiteH: number[] = parents[i].gerichte.slice(crossoverPunkt, this.laengeDerChromosomen)
        
                    const g_zweiteE_ersteH: number[] = parents[parents.length-1].gerichte.slice(0,crossoverPunkt)
                    const g_zweiteE_zweiteH: number[] = parents[parents.length-1].gerichte.slice(crossoverPunkt,this.laengeDerChromosomen)

                    let kind1 = new Chromosom(g_ersteE_ersteH.concat(g_zweiteE_zweiteH))
                    let kind2 = new Chromosom(g_ersteE_zweiteH.concat(g_zweiteE_ersteH))
        
                    // kind1.setFitness(this.fitnessEvaluation(kind1));
                    // kind2.setFitness(this.fitnessEvaluation(kind2));
        
                    kinder.push(kind1)
                    kinder.push(kind2)
                }
                else {
                    kinder.push(parents[i])
                    kinder.push(parents[parents.length-1])
                }
            } 
            const random = Math.random();
            if(random<0.9) {
                totalFitness = totalFitness + parents[i].fitness + parents[i+1].fitness 

                const g_ersteE_ersteH: number[] = parents[i].gerichte.slice(0,crossoverPunkt)
                const g_ersteE_zweiteH: number[] = parents[i].gerichte.slice(crossoverPunkt, this.laengeDerChromosomen)
    
                const g_zweiteE_ersteH: number[] = parents[parents.length-1].gerichte.slice(0,crossoverPunkt)
                const g_zweiteE_zweiteH: number[] = parents[parents.length-1].gerichte.slice(crossoverPunkt,this.laengeDerChromosomen)
    
                let kind1 = new Chromosom(g_ersteE_ersteH.concat(g_zweiteE_zweiteH))
                let kind2 = new Chromosom(g_ersteE_zweiteH.concat(g_zweiteE_ersteH))

                // kind1.setFitness(this.fitnessEvaluation(kind1));
                // kind2.setFitness(this.fitnessEvaluation(kind2));

                kinder.push(kind1)
                kinder.push(kind2)
            }
            else {
                kinder.push(parents[i])
                kinder.push(parents[i+1])
            }
        }
        // console.log("---- AVG Fitness:"+(totalFitness/parents.length).toFixed(0))
        this.mean = totalFitness/parents.length

        return kinder;
    }

    private mutation(chromosomen: Chromosom[]) {
        chromosomen.forEach(chromosom => {
            if(chromosom != this.elite) {
                let mutationGericht = Math.random();
                if(mutationGericht < 0.1) {
                        let x = Math.floor(Math.random()*this.laengeDerChromosomen)
                        for (let i = x; i < this.laengeDerChromosomen; i++) {
                            if(chromosom.gerichte[i] != 0) {
                                chromosom.gerichte[i] = 0;
                                break;
                            }
                        }
                        //chromosom.gerichte[Math.floor(Math.random() * this.laengeDerChromosomen)] = parseFloat((Math.random() * (3 - 1) + 1).toFixed(2))
                        chromosom.gerichte[Math.floor(Math.random() * this.laengeDerChromosomen)] = 1
                }
            }
            this.fitnessEvaluation(chromosom);
        });
    }

    private elitism(chromosomen: Chromosom[]) {
        // let schlechtesChromosom = chromosomen.reduce((max, sCh) => max.fitness > sCh.fitness ? max : sCh);
        // if(this.dieBeste.length == 0) {
        // }
        // else if(this.dieBeste.length == 1 && schlechtesChromosom.fitness > this.dieBeste[this.dieBeste.length-1].fitness) {
        //     chromosomen[chromosomen.indexOf(schlechtesChromosom)] = this.dieBeste[this.dieBeste.length-1];
        // }
        // else {
        //     chromosomen[chromosomen.indexOf(schlechtesChromosom)] = this.dieBeste[this.dieBeste.length-1];
        //     let zweiteSchlechtesChromosom = chromosomen.reduce((max, sCh) => max.fitness > sCh.fitness ? max : sCh);
        //     chromosomen[chromosomen.indexOf(zweiteSchlechtesChromosom)] = this.dieBeste[this.dieBeste.length-2];
        // }
        // let bestesChromosom = chromosomen.reduce((min, bCh) => min.fitness < bCh.fitness ? min : bCh);
        // this.dieBeste.push(bestesChromosom);

        let bestesChromosom = chromosomen.reduce((min, bCh) => min.fitness < bCh.fitness ? min : bCh);
        if(bestesChromosom.fitness<this.elite.fitness) {
            this.dieBeste.push(bestesChromosom)
            this.elite = bestesChromosom;
        }
        if(this.results.indexOf(this.elite.fitness) == -1) {
            this.means.push(this.mean)
            this.results.push(this.elite.fitness)
        }
    }

    ergebnis(){
        try {
            const resultat = this.dieBeste.reduce(function(prev, current) {
                return (prev.fitness < current.fitness) ? prev : current  // Survival of the Fittest
            })
    
            let gesamtProtein: number = 0;
            let gesamtFett: number = 0;
            let gesamtKohlenhydrat: number = 0;
          
            // Für jedes Gericht 
            resultat.gerichte.forEach((gen,i) => {
                if(gen>0) {
                    const gericht = this.gerichte[i];
                    gesamtProtein += gericht.protein * gen
                    console.log(gericht)
                    gesamtFett += gericht.fett *gen
                    gesamtKohlenhydrat += gericht.karb *gen
                }
            }); 
            console.log("Fitness:"+resultat.fitness);
            console.log("Protein:"+gesamtProtein);
            console.log("Fett:"+gesamtFett);
            console.log("Kohl.:"+gesamtKohlenhydrat);
            console.log("Kalorien:"+(gesamtFett*9+gesamtKohlenhydrat*4+gesamtProtein*4));
            console.log(resultat);

            const final = []
            final.push(resultat, gesamtProtein, gesamtFett, gesamtKohlenhydrat, (gesamtFett*9+gesamtKohlenhydrat*4+gesamtProtein*4))
    
            // Gesamte Kalorien für alle Zutaten
            return resultat;

        } catch (error) {
            console.log("Hier ist nicht lebendig..")
        }
    }

    getResultate() {
        const response = [this.results, this.means, this.elite ]
        return response
    }

    lebenUndLebenLassen(anzahlDerIndividuellen: number, anzahlDerPopulation: number) {
        this.anzahlDerPopulation = anzahlDerPopulation;

        let neuePopulation: Chromosom[] = this.populationInitialisieren(anzahlDerIndividuellen);

        console.log("---- INITIALISERUNG----")
        neuePopulation.forEach((individuell: Chromosom)=> { // Bestimmung der Fitness-Punkten der Neuinitialisierten
            this.fitnessEvaluation(individuell);
        })

        for (let population = 0; population < anzahlDerPopulation; population++) {
            // console.log(`---- ELTERN ${population+1} MIT TOURNAMENT ----`)
            neuePopulation = this.tournamentSelektion(neuePopulation, 2);
            // this.elitism(neuePopulation)
            // console.log(`---- KINDER ${population+1} - NEUE POPULATION ----`)
            neuePopulation = this.crossover(neuePopulation);

            this.mutation(neuePopulation);
            this.elitism(neuePopulation);

            if (this.elite.fitness < 1) { break; }

        }
    }
}

    






