import { BigInt } from "@graphprotocol/graph-ts"
import {
  MarsPredictionMarketFactory,
  CategoryUpdatedEvent,
  MilestoneUpdatedEvent,
  OutcomeChangedEvent,
  PredictionMarketCreatedEvent
} from "../generated/MarsPredictionMarketFactory/MarsPredictionMarketFactory"
import { Category, Milestone, Prediction, Outcome } from "../generated/schema"
import { MarsPredictionMarket } from '../generated/templates'


export function handleCategoryUpdatedEvent(event: CategoryUpdatedEvent): void {

  let entity = new Category(event.params.uuid.toHex())

  entity.position = event.params.position
  entity.name = event.params.name
  entity.description = event.params.description

  entity.save()
}

export function handleMilestoneUpdatedEvent(
  event: MilestoneUpdatedEvent
): void {
  var milestoneStatus = new Array<string>(3)
  milestoneStatus[0] = "Historical"
  milestoneStatus[1] = "Current"
  milestoneStatus[2] = "Future"

  var predictorsNumber = 0
  var dueDate = BigInt.fromI32(0)
  let entity = Milestone.load(event.params.uuid.toHex())
  if(entity == null) {
	entity = new Milestone(event.params.uuid.toHex())
  } else {
	  dueDate = entity.dueDate
	  predictorsNumber = entity.predictorsNumber
  }

  entity.category = Category.load(event.params.categoryUuid.toHex()).id
  entity.position = event.params.position
  entity.name = event.params.name
  entity.description = event.params.description
  entity.predictorsNumber = predictorsNumber
  entity.dueDate = dueDate

  entity.status = milestoneStatus[event.params.status]

  entity.save()	
}

export function handleOutcomeChangedEvent(event: OutcomeChangedEvent): void {

  let entity = new Outcome(event.params.uuid.toHex())

  entity.prediction = Prediction.load(event.params.predictionMarket.toHex()).id
  entity.position = event.params.position
  entity.name = event.params.name
  entity.stakedAmount = BigInt.fromI32(0)
  entity.winning = false

  entity.save()	
}

export function handlePredictionMarketCreatedEvent(
  event: PredictionMarketCreatedEvent
): void {

  let entity = new Prediction(event.params.contractAddress.toHex())
  let milestone = Milestone.load(event.params.milestoneUuid.toHex())

  entity.milestone = milestone.id
  entity.position = event.params.position
  entity.name = event.params.name
  entity.description = event.params.description
  entity.token = event.params.token
  entity.dueDate = event.params.dueDate
  entity.state = "Open"
  entity.predictorsNumber = 0

  entity.save()
  
  milestone.dueDate = entity.dueDate
  milestone.save()

  MarsPredictionMarket.create(event.params.contractAddress)
}
