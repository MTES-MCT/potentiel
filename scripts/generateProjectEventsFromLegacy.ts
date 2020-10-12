import dotenv from 'dotenv'
import { eventStore } from '../src/config/eventStore.config'
import { appelOffreRepo } from '../src/config/repos.config'
import { sequelize as newSequelize } from '../src/sequelize.config'
import '../src/config/projections.config'
import { initDatabase, sequelize as oldSequelize } from '../src/dataAccess'
import { Project } from '../src/entities'
import {
  ProjectDCRDueDateSet,
  ProjectDCRSubmitted,
  ProjectGFDueDateSet,
  ProjectGFReminded,
  ProjectGFSubmitted,
  ProjectNotified
} from '../src/modules/project/events'
dotenv.config()


//
// The purpose of this script is to create the more granular project events (ProjectNotified, ProjectDCRSubmitted, ...) for the legacy projects
// It is a companion to the generateEventsForLegacyProjects, which only creates LegacyProjectSourced events
// And also generateLegacyCertificates which create ProjectCertificateGenerated events
// With the script, we are trying to recreate the more modern events from the source projects
//

initDatabase()
  .then(async () => {
    const EventStoreModel = newSequelize.model('eventStore')
    const OldProjectEventModel = oldSequelize.model('projectEvent')
    const legacyProjectEvents = await EventStoreModel.findAll({
      where: {
        type: "LegacyProjectSourced"
      }
    })

    console.log('Found', legacyProjectEvents.length, 'legacy projects')

    



    let updatedProjects: number = 0
    let designatedEvents: number = 0
    let gfDueDateEvents: number = 0
    let gfSubmittedEvents: number = 0
    let gfRelanceEvents: number = 0
    let dcrDueDateEvents: number = 0
    let dcrSubmittedEvents: number = 0


    for (const legacyProjectEvent of legacyProjectEvents.map((item) => item.get())) {


      if(!legacyProjectEvent.aggregateId){
        console.log("generateProjectEventsFromLegacy error, event without aggregateId", legacyProjectEvent)
        continue
      }

      const project = legacyProjectEvent.payload.content as Project

      if(!project.notifiedOn){
        console.log("generateProjectEventsFromLegacy project was not notified, ignoring", project.id)
        continue
      }

      const designationEvent = await OldProjectEventModel.findOne({ where: {
        projectId: legacyProjectEvent.aggregateId,
        type: "candidate-notification"
      }})

      let projectWasNotifiedOn: number = project.notifiedOn
      if(designationEvent && designationEvent.get().createdAt){
        designatedEvents++
        projectWasNotifiedOn = designationEvent.get().createdAt
      }

      // TODO: find LegacyProjectEventSourced where aggregateId is projectId and payload.type is 'candidate-notification'
      // If found, that's the candidateNotifiedOn date which should be used for occurredAt on ProjectNotified, DCR/GFDueDateSet

      await eventStore.publish(
        new ProjectNotified({
          payload: {
            projectId: legacyProjectEvent.payload.projectId,
            candidateEmail: project.email,
            periodeId: legacyProjectEvent.payload.periodeId,
            appelOffreId: legacyProjectEvent.payload.appelOffreId,
            familleId: legacyProjectEvent.payload.familleId,
            notifiedOn: project.notifiedOn,
          },
          aggregateId: legacyProjectEvent.aggregateId,
          original: {
            occurredAt: new Date(projectWasNotifiedOn),
            version: 1
          }
        })
      )

      if(project.garantiesFinancieresDueOn){
        gfDueDateEvents++
        await eventStore.publish(
        new ProjectGFDueDateSet({
          payload: {
            projectId: legacyProjectEvent.payload.projectId,
            garantiesFinancieresDueOn: project.garantiesFinancieresDueOn
          },
          aggregateId: legacyProjectEvent.aggregateId,
          original: {
            occurredAt: new Date(projectWasNotifiedOn),
            version: 1
          }
        })
      )
      }
      else{
        
        if(project.classe === "Classé"){
          const familleResult = await appelOffreRepo.getFamille(project.appelOffreId, project.familleId)

          if(familleResult.isErr()){
            console.log("Cannot find famille for ", project.appelOffreId, project.familleId)
          }
          else{
            if(familleResult.value.garantieFinanciereEnMois || familleResult.value.soumisAuxGarantiesFinancieres){
              console.log("generateProjectEventsFromLegacy project was notified but no garantiesFinancieresDueOn, weird", legacyProjectEvent.payload.projectId, project.appelOffreId, project.periodeId, project.familleId )
            }  
          } 
        
          
        }
      }

      if(project.dcrDueOn){
        dcrDueDateEvents++
        await eventStore.publish(
        new ProjectDCRDueDateSet({
          payload: {
            projectId: legacyProjectEvent.payload.projectId,
            dcrDueOn: project.dcrDueOn
          },
          aggregateId: legacyProjectEvent.aggregateId,
          original: {
            occurredAt: new Date(projectWasNotifiedOn),
            version: 1
          }
        })
      )
      }

      if(project.dcrSubmittedOn && project.dcrFileId){
        dcrSubmittedEvents++
        await eventStore.publish(
        new ProjectDCRSubmitted({
          payload: {
            projectId: legacyProjectEvent.payload.projectId,
            dcrDate: new Date(project.dcrDate),
            fileId: project.dcrFileId,
            numeroDossier: project.dcrNumeroDossier,
            submittedBy: project.dcrSubmittedBy
          },
          aggregateId: legacyProjectEvent.aggregateId,
          original: {
            occurredAt: new Date(project.dcrSubmittedOn),
            version: 1
          }
        })
      )
      }

      if(project.garantiesFinancieresSubmittedOn && project.garantiesFinancieresFileId){
        gfSubmittedEvents++
        await eventStore.publish(
        new ProjectGFSubmitted({
          payload: {
            projectId: legacyProjectEvent.payload.projectId,
            gfDate: new Date(project.garantiesFinancieresDate),
            fileId: project.garantiesFinancieresFileId,
            submittedBy: project.garantiesFinancieresSubmittedBy
          },
          aggregateId: legacyProjectEvent.aggregateId,
          original: {
            occurredAt: new Date(project.garantiesFinancieresSubmittedOn),
            version: 1
          }
        })
      )
      }

      if(project.garantiesFinancieresRelanceOn){
        gfRelanceEvents++
        await eventStore.publish(
        new ProjectGFReminded({
          payload: {
            projectId: legacyProjectEvent.payload.projectId,
          },
          aggregateId: legacyProjectEvent.aggregateId,
          original: {
            occurredAt: new Date(project.garantiesFinancieresRelanceOn),
            version: 1
          }
        })
      )
      }


      updatedProjects++
    }

    console.log(
      '\nGenerated events for ',
      updatedProjects,
      'projects'
    )
    console.log(
      '\nFound designation event for',
      designatedEvents,
      'projects'
    )
    console.log("gfDueDateEvents", gfDueDateEvents)
    console.log("gfSubmittedEvents", gfSubmittedEvents)
    console.log("gfRelanceEvents", gfRelanceEvents)
    console.log("dcrDueDateEvents", dcrDueDateEvents)
    console.log("dcrSubmittedEvents", dcrSubmittedEvents)
  })
  .catch((err) => {
    console.log('Caught error', err)
    process.exit(1)
  })
