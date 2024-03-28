export const address = "0x6eF1C0Dd6Db23521442a6fC68F161b82Ae89Baa9";

//Enums are not a thing in typescript, so this will have to do.
export const MetadataTypes: Record<string,number> = 
{
	//"ERROR TYPE": -2.
	"Owner": -1,
	"DisplayName": 1,
	"Description": 2,
	"ProfileImage": 3,
	"BannerImage": 4
}

//Data, BlockNum. Data hold the data as a string, BlockNum stores the block number. That was we dont set old data.
export class MetadataValue {
	data: string = "";
	blockNum: number = -2;
	Debug: string = "EMPTY";
	Debug2: number = -2;
}




export class Metadata
{
	public data: Record<number, MetadataValue> = {}; //To make this more dynamic, we use a key value pair here.
	//e.g. this.data["DisplayName"].data returns the display name.

	public getData(key_in: any): string
	{
		var key: number; //Typescript does not allow overriding by types, so this will have to do.
		if (typeof key_in === "string") key = Number(this.MDStringToNum(key_in));
		else if (typeof key_in === "number") key = Number(key_in); 
		else throw "Bad key TYPE";
		
		if (!(key in this.data)) return "ERROR" //TODO: More error handling here?

		return this.data[key].data;
	}

	// public setData(key_str: string, data: string, blockNum: number): number
	// {
	// 	var key = this.getMetadataType(Number(key_str));
	// 	this.setData(key, data, blockNum);
	// }
	public setData(key_in: any, data: string, blockNum: number): Number //Returns indicates status. 0 => failed, 1=> already set 2=> done.
	{
		var key: number; //Typescript does not allow overriding by types, so this will have to do.
		if (typeof key_in === "string") key = Number(this.MDStringToNum(key_in));
		else if (typeof key_in === "number") key = Number(key_in); 
		else throw "Bad key TYPE";

		if (!(key in this.data))
		{
			//We're creating it here because it's undefined.
			var tmp: MetadataValue = new MetadataValue()
			tmp.blockNum = blockNum
			tmp.data = data;
			tmp.Debug = this.MDNumToString(key);
			tmp.Debug2 = key;
			this.data[key] = tmp;
			console.log(["Setting", key, "With", data])
			return 2; //Success
		}
		else
		{
			if (this.data[key].blockNum > blockNum) 
			{
				console.log(["Not replacing data:", key_in, data, blockNum]);
				return 1;
			}
			else
			{
				this.data[key].data = data;
				this.data[key].blockNum = blockNum;
				console.log(["Replacing", key, "With", data])
				return 2 //Success
			}
		}

		throw "This shouldn't happen.";
	}

	MDNumToString(num: number): string
	{
		for (const key in MetadataTypes)
		{
			if (MetadataTypes[key] == num) return key;
		}
		return "ERROR";
	}
	MDStringToNum(k: string): Number
	{
		for (const key in MetadataTypes)
		{
			if (key.toLowerCase() == k.toLowerCase()) return MetadataTypes[key];
		}
		return -2;
	}



	constructor()
	{

	}

	getMetadataType(num: number)
	{
		for (const key in MetadataTypes)
		{
			if (MetadataTypes[key] == num) return key;
		}
		return null;
	}

	setByBlockData(metadataId: string, data: string, blockNum: number)
	{
		var key = this.getMetadataType(Number(metadataId));
		if (key == null) return; //Invalid key, disregard.

		if (key == "DisplayName")
		{
			this.setDisplayName(data, blockNum);
		}
		else if (key == "Owner")
		{
			this.setOwner(data, blockNum);
		}
		else if (key == "Description")
		{
			this.setDescription(data, blockNum);
		}
		else if (key == "ProfileImage")
		{
			this.setProfileImage(data, blockNum);
		}
		else if (key == "BannerImage")
		{
			this.setBannerImage(data, blockNum);
		}

	}


	setByBlockData_old(blockData: any, blockNum: number)
	{
		console.log("setByBlockData")
		for (var key in blockData)
		{
			if (!(key in MetadataTypes)) return; //Invalid key, disregard.

			if (key == "DisplayName")
			{
				this.setDisplayName(blockData[key], blockNum);
			}
			else if (key == "Owner")
			{
				this.setOwner(blockData[key], blockNum);
			}
			else if (key == "Description")
			{
				this.setDescription(blockData[key], blockNum);
			}
			else if (key == "ProfileImage")
			{
				this.setProfileImage(blockData[key], blockNum);
			}
			else if (key == "BannerImage")
			{
				this.setBannerImage(blockData[key], blockNum);
			}
		}
	}

	public Owner:string = "";
	private Owner_blockNum:number = -1;
	setOwner(data:string, blockNum: number)
	{
		if (this.Owner_blockNum > blockNum) return; //We already have the up to date version. Do not update.
		this.Owner = data;
	}

	public DisplayName:string = "";
	private DisplayName_blockNum:number = -1;
	setDisplayName(data:string, blockNum: number)
	{
		if (this.DisplayName_blockNum > blockNum) return; //We already have the up to date version. Do not update.
		this.DisplayName = data;
	}

	public Description:string = "";
	private Description_blockNum:number = -1;
	setDescription(data:string, blockNum: number)
	{
		if (this.Description_blockNum > blockNum) return; //We already have the up to date version. Do not update.
		this.Description = data;
	}

	public ProfileImage:string = "";
	private ProfileImage_blockNum:number = -1;
	setProfileImage(data:string, blockNum: number)
	{
		if (this.ProfileImage_blockNum > blockNum) return; //We already have the up to date version. Do not update.
		this.ProfileImage = data;
	}

	public BannerImage:string = "";
	private BannerImage_blockNum:number = -1;
	setBannerImage(data:string, blockNum: number)
	{
		if (this.BannerImage_blockNum > blockNum) return; //We already have the up to date version. Do not update.
		this.BannerImage = data;
	}




}

export const abi = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "metadataID",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "data",
				"type": "string"
			}
		],
		"name": "Metadata",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "tag",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "myString",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "poster",
				"type": "address"
			}
		],
		"name": "Post",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "tag",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "value",
				"type": "string"
			}
		],
		"name": "DoPost",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "string[]",
				"name": "metadataID",
				"type": "string[]"
			},
			{
				"internalType": "string[]",
				"name": "data",
				"type": "string[]"
			}
		],
		"name": "SetBulkMetadata",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "metadataID",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "data",
				"type": "string"
			}
		],
		"name": "SetMetadata",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "string[]",
				"name": "metadataIDs",
				"type": "string[]"
			}
		],
		"name": "getBulkMetadata",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "tag",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_n",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "offset",
				"type": "uint256"
			}
		],
		"name": "getFirstNBlocks",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "tag",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "numItems",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "offset",
				"type": "uint256"
			}
		],
		"name": "getLastNBlocks",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "tag",
				"type": "string"
			}
		],
		"name": "getNonce",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "ret",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getVersion",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "metadata",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "nonces",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "postIdToBlockNum",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]