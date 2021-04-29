import { BigInt } from "@graphprotocol/graph-ts"
import {
  PredictionEvent
} from "../generated/templates/MarsPredictionMarket/MarsPredictionMarket"
import { Prediction, Outcome, Milestone } from "../generated/schema"


export function handlePredictionEvent(
  event: PredictionEvent
): void {

  let entity = Prediction.load(event.address.toHex())
  
  if(entity != null) {

	  entity.predictorsNumber = entity.predictorsNumber + 1
	  entity.save()
	  
	  let milestone = Milestone.load(entity.milestone)
	  milestone.predictorsNumber = milestone.predictorsNumber + 1
	  milestone.save()
	  
	  let outcome = Outcome.load(event.params._outcome.toHex())
	  outcome.stakedAmount = outcome.stakedAmount + event.params._amount
	  outcome.save()
  }
}
