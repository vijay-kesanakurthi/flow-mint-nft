export const mintNFT = 
`
// REPLACE THIS WITH YOUR CONTRACT NAME + ADDRESS
import Dino from 0x7295aa9951177f41 

// Do not change these
import NonFungibleToken from 0x631e88ae7f1d7c20
import MetadataViews from 0x631e88ae7f1d7c20

transaction(
  recipient: Address,
  name: String,
  description: String,
  thumbnail: String,
) {
  prepare(signer: AuthAccount) {
    if signer.borrow<&Dino.Collection>(from: Dino.CollectionStoragePath) != nil {
      return
    }

    // Create a new empty collection
    let collection <- Dino.createEmptyCollection()

    // save it to the account
    signer.save(<-collection, to: Dino.CollectionStoragePath)

    // create a public capability for the collection
    signer.link<&{NonFungibleToken.CollectionPublic, MetadataViews.ResolverCollection}>(
      Dino.CollectionPublicPath,
      target: Dino.CollectionStoragePath
    )
  }


  execute {
    // Borrow the recipient's public NFT collection reference
    let receiver = getAccount(recipient)
      .getCapability(Dino.CollectionPublicPath)
      .borrow<&{NonFungibleToken.CollectionPublic}>()
      ?? panic("Could not get receiver reference to the NFT Collection")

    // Mint the NFT and deposit it to the recipient's collection
    Dino.mintNFT(
      recipient: receiver,
      name: name,
      description: description,
      thumbnail: thumbnail,
    )
    
    log("Minted an NFT and stored it into the collection")
  } 
}
`