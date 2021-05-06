import { BigInt } from "@graphprotocol/graph-ts"
import {
  Settlement,
  PotentialOracleEvent,
  OracleAcceptedEvent,
  OracleVotedEvent,
  OutcomeDefinedEvent
} from "../generated/Settlement/Settlement"
import { Category, Milestone, Prediction, Outcome } from "../generated/schema"

export function handlePotentialOracleEvent(event: PotentialOracleEvent): void {}

export function handleOracleAcceptedEvent(event: OracleAcceptedEvent): void {}

export function handleOutcomeDefinedEvent(event: OutcomeDefinedEvent): void {

  let entity = Outcome.load(event.params._outcome.toHex())
  entity.winning = true
  entity.save()
  
  let prediction = Prediction.load(event.params._predictionMarket.toHex())
  prediction.state = "Closed"
  prediction.save()
}

export function handleOracleVotedEvent(
  event: OracleVotedEvent
): void {

  let entity = Prediction.load(event.params._predictionMarket.toHex())
  entity.state = "Settlement"
  entity.save()
}
