import {
  NewGravatarLog,
  UpdatedGravatarLog,
} from "../types/abi-interfaces/Gravity";
import {Gravatar, USDT} from "../types";
import {TransferLog} from "../types/abi-interfaces/USDT";

export async function handleNewGravatar(log: NewGravatarLog): Promise<void> {
  logger.info("New Gravar at block " + log.blockNumber.toString());
  const gravatar = Gravatar.create({
    id: log.args.id.toHexString(),
    owner: log.args.owner,
    displayName: log.args.displayName,
    imageUrl: log.args.imageUrl,
    createdBlock: BigInt(log.blockNumber),
  });

  await gravatar.save();
}

export async function handleUsdt(log:TransferLog): Promise<void> {
  logger.info("USDT Transfer at block " + log.blockNumber.toString());
  const usdt = USDT.create({
    id: log.transaction.hash,
    from: log.args.from,
    to: log.args.to,
    value: log.args.value.toBigInt(),
    createdBlock: BigInt(log.blockNumber),
  });


  await usdt.save();
}

export async function handleUpdatedGravatar(
    log: UpdatedGravatarLog
): Promise<void> {
  logger.info("Updated Gravar at block " + log.blockNumber.toString());
  const id = log.args.id.toHexString();

  // We first check if the Gravatar already exists, if not we create it
  let gravatar = await Gravatar.get(id);
  if (gravatar == null || gravatar == undefined) {
    gravatar = new Gravatar(id);
    gravatar.createdBlock = BigInt(log.blockNumber);
  }
  // Update with new data
  gravatar.owner = log.args.owner;
  gravatar.displayName = log.args.displayName;
  gravatar.imageUrl = log.args.imageUrl;
  await gravatar.save();
}
