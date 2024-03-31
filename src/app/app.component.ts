import { Component, Injectable, OnInit, TemplateRef, ViewChild, inject  } from '@angular/core';
import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';

import { ActivatedRoute } from '@angular/router';

import Web3, { errors } from "web3";
import { address, abi, Metadata } from './abi';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { match } from 'assert';
import { Meta } from '@angular/platform-browser';


let testTxt = `
Text block 1
--- START IMAGE ---
/9j/4AAQSkZJRgABAQEAYABgAAD/4QAiRXhpZgAATU0AKgAAAAgAAQESAAMAAAABAAEAAAAAAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAAPABUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6MsPiT42/Zp+LEK3Ft/aGn27+S6xuHhlVj905wQMdv4D7HFeu/Fjwvovxs8ITGFZNPfV4+bdwjZ3YDgDBAdeuR94c8814h8ddZ8TWfjzTYdPghuGaUXRiuJR5coQZ5PJyQe4r1bwDDp/7QHhW8sbg3Gi6paqs0RhdtocDcFypHAwcHqPpXyOKqYXizLaWIpNRx1LWTWjlZ78qejT10v1s1K59VxH7DF5dDLc0oKEoxtGal79OS20Tu431jbS146Rsl5Xcfs/+K/hNdSaTpGr2dxYrh4mkcklCBjq2O2CQeSDnFFeveENAvtK0pU1q4sbppCXglnh8xWXJBwBypBHOeCcEdTRXNh/GrFYGmsHj/wB5VhpKThBttdW3Zt262KwuHzPD0Y0Y4SclFL3oWcX5puSeu+qvffU//9k=
--- END IMAGE ---
Text block 2
--- START IMAGE ---
/9j/4AAQSkZJRgABAQEAYABgAAD/4QAiRXhpZgAATU0AKgAAAAgAAQESAAMAAAABAAEAAAAAAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAAPABUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6MsPiT42/Zp+LEK3Ft/aGn27+S6xuHhlVj905wQMdv4D7HFeu/Fjwvovxs8ITGFZNPfV4+bdwjZ3YDgDBAdeuR94c8814h8ddZ8TWfjzTYdPghuGaUXRiuJR5coQZ5PJyQe4r1bwDDp/7QHhW8sbg3Gi6paqs0RhdtocDcFypHAwcHqPpXyOKqYXizLaWIpNRx1LWTWjlZ78qejT10v1s1K59VxH7DF5dDLc0oKEoxtGal79OS20Tu431jbS146Rsl5Xcfs/+K/hNdSaTpGr2dxYrh4mkcklCBjq2O2CQeSDnFFeveENAvtK0pU1q4sbppCXglnh8xWXJBwBypBHOeCcEdTRXNh/GrFYGmsHj/wB5VhpKThBttdW3Zt262KwuHzPD0Y0Y4SclFL3oWcX5puSeu+qvffU//9k=
--- END IMAGE ---
Text block 3
`.trim()



const exampleImage = "data:image/jpg;base64, " + "/9j/4AAQSkZJRgABAQEAYABgAAD/4QAiRXhpZgAATU0AKgAAAAgAAQESAAMAAAABAAEAAAAAAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAAPABUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6MsPiT42/Zp+LEK3Ft/aGn27+S6xuHhlVj905wQMdv4D7HFeu/Fjwvovxs8ITGFZNPfV4+bdwjZ3YDgDBAdeuR94c8814h8ddZ8TWfjzTYdPghuGaUXRiuJR5coQZ5PJyQe4r1bwDDp/7QHhW8sbg3Gi6paqs0RhdtocDcFypHAwcHqPpXyOKqYXizLaWIpNRx1LWTWjlZ78qejT10v1s1K59VxH7DF5dDLc0oKEoxtGal79OS20Tu431jbS146Rsl5Xcfs/+K/hNdSaTpGr2dxYrh4mkcklCBjq2O2CQeSDnFFeveENAvtK0pU1q4sbppCXglnh8xWXJBwBypBHOeCcEdTRXNh/GrFYGmsHj/wB5VhpKThBttdW3Zt262KwuHzPD0Y0Y4SclFL3oWcX5puSeu+qvffU//9k="

interface Post 
{
  id: number;
  msg: string;
  date: Date;
  poster: string;
  postData: DataBlock[];
}

class Profile
{
  DisplayName: string = "";
  Description: string = "";
  profileImage: string = "";
  bannerImage: string = "";
}

type DataType = 'TEXT' | 'IMAGE';

interface DataBlock 
{
    type: DataType;
    data: string;
}

declare global 
{
  interface Window { ethereum: any; }
}

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit
{
  @ViewChild("test_modal") test_modal!: TemplateRef<any>;
  @ViewChild("TermsOfService") TermsOfService!: TemplateRef<any>;
  @ViewChild("content") content!: TemplateRef<any>;
  @ViewChild("DoPost") DoPost!: TemplateRef<any>;

  exampleImage = exampleImage;
  defaultImageSource: string = "/assets/pixels2.jpg"
  //profileData: Record<string, string> = {};
  profileData = new Profile();

  userProfile = new Profile();
  viewProfile = new Profile();

  metadatas: Record<string, Metadata> = {};

  tag: string = "home"; //<--- ****This is the "topic" of the conversation. In a social media setting, this is the profile page.****
  //This is tag as in hashtag. In Twitter (and others) you'd search by hashtags. I'm using this also to refer to pages.
  //If you're on a person's profile, it will be a wallet address e.g. 0x1234567890123456789012345678901234567890.
  //In the case of a person's page, only that person can post on that page. (As of writing this, might change in the future.)
  //In the case of any other page, anyone may post.
  //Worth noting. I forsee pages like "0x00...00_", "0><00...00" or "Ox00...000" to deceive users. Perhaps clone profiles?

  contractAddress: string = address;

  test123(v: Profile)
  {
    v.Description = "HELLO!";
  }

  TOS_Declined()
  {
    location.href = "https://example.com/";
  }

  TOS_Accepted()
  {
    this.setCookie("TOS", "accepted", 30);
    location.reload()
  }

  isLoaded: boolean = false;
  async ngOnInit()  //This occurs BEFORE the component views and child views are initialized
  {

  }

  ngAfterViewInit() //This occurs AFTER the component views and child views are initialized
  {
    let is_tos_accepted = this.getCookie("TOS");
    if (is_tos_accepted == "accepted")
    {
      //Do nothing, proceed
    }
    else //User must accept TOS to proceed. Stop processing and show dialog.
    {
      this.open(this.TermsOfService, false, "TOS-modal")
      return;
    }



    

    console.log(["ParseData", testTxt, this.parseData(testTxt)])

    console.log(["test123", this.viewProfile])
    this.test123(this.viewProfile)
    console.log(["test123", this.viewProfile])


    this.profileData = this.emptyProfileData();

    //Handle routing. In this app, we're using #. # (fragment)s are not sent to the server.
    //This provides privacy to the user. When the user visits the ipfs server, the ipfs server never knows what page you're looking at.
    this.route.fragment.subscribe(async (fragment) => { 
      //Note: This runs independent of the outside function. Notice the Subscribe.
      //Note: This function runs each time the url changes.
      console.log(["fragment", fragment]);
      
      if (fragment?.trim().length == 0) return //No url variables provided.
      else if (fragment?.includes("&")) //Multiple variables provided
      {
        for (var str of fragment.split("&")) //Iterate on each variable
        {
          console.log(["str:", str]);
          var tmp = str.split("="); //Anything else here is currently overkill. If not done correctly, anything more complicated could be exploitable.
          if (tmp[0].toLowerCase() == "contract") this.contractAddress = tmp[1]; //The contract of the "backend"
          if (tmp[0].toLowerCase() == "tag") this.tag = tmp[1]; //The "page" we're looking at.
        }
      }
      else if (fragment?.includes("=")) //A single variable is provided.
      {
        var tmp = fragment?.split("=");
        if (tmp[0].toLowerCase() == "contract") 
        {
          console.log(["tmpA:", tmp]);
          this.contractAddress = tmp[1];
        }
        if (tmp[0].toLowerCase() == "tag") 
        {
          console.log(["tmpB:", tmp]);
          this.tag = tmp[1];
        }
      }

      if (this.isLoaded) await this.resetPage(); //If the page is already loaded, we need to reload it. Note: This is not a hard reload.
    });
    
    console.log("ngOnInit")

    this.doStartCheck(); // Try to access metamask.
    return false;
  }

  profiles: Record<string, Profile> = {};

  async fetchUserProfile(account: string)
  {
    if (account in this.profiles) return;


    var metadataBlocks = await this.getBulkMetadata(account, ["1", "2", "3", "4"])
    type retType = [number, any]
    var metadata: retType[] = await this.getMetadata(metadataBlocks);
    if (metadata.length > 0)
    {
      console.log(["metadata_actuallyStart", metadata]);
  
      var this_metadata = new Metadata()
  
      for (const block of metadata)
      {
        var md: any = block[1]
        console.log(["md", md]);
        this_metadata.setData(Number(md["metadataID"]), md["data"], Number(block[0]))
      }
  
      console.log(["this_metadata", this_metadata.data]);
      this.profiles[account] = this.fillProfileData(this_metadata);
      console.log(["this.profiles[account]", this.profiles[account]]);
      //===== Get this user's profile data =====
    }
    else
    {
      //this.profileData = this.emptyProfileData();
      //if (this.tag.substr(0,2).toLowerCase() !== "0x") this.profileData.Description = `You are browsing the ${this.tag} page.`
      //else this.profileData.Description = "This user has not set a description."
      //console.log(["this.profileData", this.profileData]);
    }

  }

  async actuallyStart() //This is where the program actually starts. Initial checks are completed by this point. (metamask is available)
  {
    console.log("actuallyStart")
    this.accounts = await this.web3js.eth.getAccounts(); 
    console.log(["this.accounts", this.accounts]);

    var version = await this.getVersion();
    console.log(["version", version]);
    if (version == 0)
    {
      this.toastr.error("This contract address is not valid. Stopping...")
      return
    }


    //===== Get this user's profile data =====
    //Fetch the profile's metadata (profile picture, banner, name, description)
    
    this.profileData = this.emptyProfileData(); //Blank profile for transition.

    //Fetch the profile of the logged in user.
    this.fetchUserProfile(this.accounts[0]).then(
      () =>
      {
            var userProfile = this.profiles[this.accounts[0]] //Set the metadata for this user so they can edit their metadata.
            
            this.profile_form_variables.description = userProfile?.Description;
            if (!this.profile_form_variables.description) this.profile_form_variables.description = "Description Not Set"
            this.defaultValues.description = this.profile_form_variables.description;
            
            this.profile_form_variables.displayName = userProfile?.DisplayName;
            if (!this.profile_form_variables.displayName) this.profile_form_variables.displayName = "Display Name Not Set"
            this.defaultValues.name = this.profile_form_variables.displayName;
            
            
            this.profile_form_variables.profileImg_b64 = userProfile?.profileImage;
            if (!this.profile_form_variables.profileImg_b64) this.profile_form_variables.profileImg_b64 = exampleImage;
            this.defaultValues.profileImg = this.profile_form_variables.profileImg_b64;
            
            
            this.profile_form_variables.bannerImg_b64 = userProfile?.bannerImage;
            if (!this.profile_form_variables.bannerImg_b64) this.profile_form_variables.bannerImg_b64 = exampleImage;
            this.defaultValues.bannerImg = this.profile_form_variables.bannerImg_b64;
            
            console.log(["this.profile_form_variables", this.profile_form_variables])
            
            
            //If this IS a user profile
            if (this.tag.substring(0,2).toLowerCase() === "0x")
            {
              //if this IS THIS user's profile
              if (this.tag.toLowerCase() === this.accounts[0].toLowerCase())
              {
                this.profileData = this.profiles[this.accounts[0]]; //We already have this user's profile loaded.
              }
          
          //if this is NOT this user's profile
          else
          {
            this.fetchUserProfile(this.tag.toLowerCase()).then(
              () => 
              {
                this.profileData = this.profiles[this.tag.toLowerCase()]; //We fetch the profile of this user to display their data.
                console.log(["==A Set to ", this.profileData])
              }
              )
            }
            
          }
          else //if this is NOT a user profile
          {
            console.log(["this.tag is NOT user profile.", this.tag])

            var tmpProfile = this.emptyProfileData()
            tmpProfile.DisplayName = this.tag;
            tmpProfile.Description = `You are browsing \"${this.tag}\". This is not a user profile. Anyone may post here. If you are told this is a profile, you are being lied to.`
            tmpProfile.bannerImage = exampleImage;
            tmpProfile.profileImage = exampleImage;
            this.profileData = tmpProfile;
          }
          console.log(["this.profiles", this.profiles, "this.ProfileData", this.profileData]);
      }
    )
    

    
    this.estGasPrice().then(val => 
      {
        this.gasPrice = val / 1000000000;
      })
      .catch(error => 
      {
        console.error(error);
      }
    );

    console.log(["this.gasPrice", this.gasPrice]);



    this.DoGetPosts();

    this.isLoaded = true;
  }
  gasPrice: number = 0

  addrs: Array<string> = [];
  generateRandomStrings() 
  {
    for (let i = 0; i < 12; i++) 
    {
        let str = '';
        for (let j = 0; j < 40; j++) 
        {
            str += Math.floor(Math.random() * 16).toString(16);
        }
        this.addrs.push(str);
    }
    this.addrs[4] = this.addrs[2];
}

async DoGetPosts()
{
  var nonce = await this.getNonce();
    console.log(["nonce", nonce]);
    if (nonce == 0)
    {
      console.log("nonce is 0, skipping");
      return;
    }

    this.accounts = await this.web3js.eth.getAccounts(); 

    const contract = new this.web3js.eth.Contract(abi, this.contractAddress);

    //To implement pagination, we need to build off of this. Usage is simple. getLast(or First)NBlocks(the "page"'s name, number of posts to get, the offset (used for pagination.))
    //var tmp = contract.methods.getFirstNBlocks(this.tag, nonce, 0);
    var tmp = contract.methods.getLastNBlocks(this.tag, nonce, 0);

    var encoded = await this.eth_call(this.accounts[0], this.contractAddress, tmp.encodeABI());
    if (encoded == "0x") return;
    var ret_tmp = this.web3js.eth.abi.decodeParameters(['uint256[]'], encoded);
    //var ret = ret_tmp[0];
    var ret = [...ret_tmp[0]]; // create a new array and copy the values from ret_tmp
    
    this.posts = []
    
    for (var i = 0; i < ret.length; i++)
    {
      var blockId = Number(ret[i]); //convert all bigints to numbers

      //var blockId = blockIds[i];
      var block = await this.web3js.eth.getBlock(blockId, true); //Replace this with eth_getBlockByNumber. This will fetch all of the transactions at once, allowing us to filter out the transactions that do not apply to us.
      //In theory, we could also extract the post data from the data field itself.
      //TODO: Remove the await here and make it run all at once?
      var timestamp = block.timestamp;
      var humanReadableTimestamp = new Date(Number(timestamp) * 1000);
      console.log(["block", block]);
      var transactions = block.transactions;
      for (var j = 0; j < transactions.length; j++) 
      {
        var tx_tmp = transactions[j];
        if ("to" in tx_tmp && tx_tmp["to"] !== null && tx_tmp["to"].toLowerCase() === this.contractAddress.toLowerCase())
        {
          //Do nothing, this is ours.
        }
        else
        {
          console.log("Not related to our contract, skipping.");
          continue;
        }
        var tx = transactions[j]["hash"];

        console.log(["getTransactionReceipt", tx]);
        //Get transaction receipt
        var tx2 = await this.web3js.eth.getTransactionReceipt(tx); //TODO: Add error handling here
        console.log(["tx2", tx2]);

        var type = this.fetch_abi_type("post")
        if (type == -1) throw new Error('Error in abi!');

        try
        {

          var post = this.web3js.eth.abi.decodeLog( //TODO: Add error handling here
          abi[type].inputs,
          tx2.logs[0].data,
          tx2.logs[0].topics
          );
        }
        catch (e)
        {
          console.error(e);
          continue; //Something went wrong with this loop. Skip it and keep trying.
          //TODO: Improve handling here
            
        }
        console.log(["Post", post]);


        console.log({id: Number(post.id), msg: post.myString, date: humanReadableTimestamp, poster: post.poster});

        var tmpPost = 
          {
            id: Number(post.id), 
            msg: post.myString,
            date: humanReadableTimestamp, 
            poster: post.poster,
            postData: this.parseData(post.myString)
          };

          tmpPost.postData = this.parseData(tmpPost.msg);
          this.posts.push(tmpPost);
          console.log(["post:", tmpPost]);
      }
    } 
}

  // async DoGetPosts2()
  // {
  //   var nonce = await this.getNonce();
  //   console.log(["nonce", nonce]);
  //   if (nonce == 0)
  //   {
  //     console.log("nonce is 0, skipping");
  //     return;
  //   }

  //   var blocks = await this.getFirstNBlocks(nonce);
    
  //   console.log(["blocks", blocks]);

  //   var posts = await this.getPosts(blocks);

  //   this.posts = []
  //   for (var i = 0; i < posts.length; i++)
  //   {
  //     var tmpPost = posts[i]
  //     tmpPost.postData = this.parseData(posts[i].msg);
  //     this.posts.push(tmpPost);
  //     console.log(["post:", tmpPost]);

  //   }
  // }

  // async getPosts(blockIds: number[]): Promise<Post[]> 
  // {
  //   var ret: Post[] = [];
  //   //const posts: [number, string][] = [];

  //   for (var i = 0; i < blockIds.length; i++) 
  //   {
  //     var blockId = blockIds[i];
  //     var block = await this.web3js.eth.getBlock(blockId);
  //     var timestamp = block.timestamp;
  //     var humanReadableTimestamp = new Date(Number(timestamp) * 1000);
  //     console.log(["block", block]);
  //     var transactions = block.transactions;
  //     for (var j = 0; j < transactions.length; j++) 
  //     {
  //       var tx = transactions[j];
  //       //Get transaction receipt
  //       var tx2 = await this.web3js.eth.getTransactionReceipt(tx);
  //       console.log(["tx2", tx2]);

  //       var type = this.fetch_abi_type("post")
  //       if (type == -1) throw new Error('Error in abi!');

  //       var post = this.web3js.eth.abi.decodeLog(
  //         abi[type].inputs,
  //         tx2.logs[0].data,
  //         tx2.logs[0].topics
  //       );
  //       console.log(["Post", post]);

  //       //var tx2 = await this.web3js.eth.getTransaction(tx);
  //       //console.log(["tx2", tx2]);

  //       //posts.push([Number(Post.id), Post.myString]);

  //       console.log({id: Number(post.id), msg: post.myString, date: humanReadableTimestamp, poster: post.poster});

  //       ret.push(
  //         {
  //           id: Number(post.id), 
  //           msg: post.myString,
  //           date: humanReadableTimestamp, 
  //           poster: post.poster,
  //           postData: this.parseData(post.myString)
  //         });
  //     }
  //   }

  //   return ret;
  // }

  emptyProfileData()
  {
    var tmp = new Profile()
    tmp.Description = "No description provided.";
    tmp.DisplayName = "Name not set";
    tmp.bannerImage = exampleImage;
    tmp.profileImage = exampleImage;
    //targetProfile = tmp;
    return tmp;
  }


  fillProfileData(metadata: Metadata)
  {
    var targetProfile: Profile = new Profile();
    var DisplayName = metadata.getData("DisplayName")
    if (DisplayName == "ERROR") DisplayName = "Name Not Set."
    //this.profileData["DisplayName"]  = DisplayName; 
    targetProfile.DisplayName = DisplayName;
    this.defaultValues.name = DisplayName;


    var Description = metadata.getData("Description")
    if (Description == "Error") Description = "Description Not Set."
    //this.profileData["Description"] = Description;
    targetProfile.Description = Description;
    this.defaultValues.description = Description;

    var ProfileImage = metadata.getData("ProfileImage")
    if (ProfileImage == "Error") ProfileImage = "ProfileImage Not Set."
    if (ProfileImage.includes("data:image/jpg;base64,")) ProfileImage = ProfileImage.replace("data:image/jpg;base64,", "") //TODO: handle this properly. We don't want to allow image types other than jpg.
    if (ProfileImage.includes("data:image/jpeg;base64,")) ProfileImage = ProfileImage.replace("data:image/jpeg;base64,", "") //TODO: handle this properly. We don't want to allow image types other than jpg.

    if (!this.isValidBase64(ProfileImage))
    {
      console.error("User has invalid ProfileImage. Not using for safety.")
    }
    else
    {
      //this.profileData["ProfileImage"] = "data:image/jpg;base64, " + ProfileImage;
      targetProfile.profileImage = "data:image/jpg;base64, " + ProfileImage;
      //TODO: add different image types? I cant imagine people would willingly use anything other than jpeg here. Maybe enforce type in upload?
    }

    var BannerImage = metadata.getData("BannerImage")
    if (BannerImage == "Error") BannerImage = "BannerImage Not Set."
    if (BannerImage.includes("data:image/jpg;base64,")) BannerImage = BannerImage.replace("data:image/jpg;base64,", "") //TODO: handle this properly. We don't want to allow image types other than jpg.
    if (BannerImage.includes("data:image/jpeg;base64,")) BannerImage = BannerImage.replace("data:image/jpeg;base64,", "") //TODO: handle this properly. We don't want to allow image types other than jpg.
    if (!this.isValidBase64(BannerImage))
    {
      console.error("User has invalid BannerImage. Not using for safety.")
    }
    else
    {
      targetProfile.bannerImage = "data:image/jpg;base64, " + BannerImage;
      //TODO: add different image types? I cant imagine people would willingly use anything other than jpeg here. Maybe enforce type in upload?
      //PNG would be too large, as would raw. webp could be dangerous. gif would provide animation, but would not be ideal. svg might be a good option.
    }
    //TODO: Add error handling here to missing images.
    return targetProfile;
  }

  stringToHex(str: string) 
  {
    let hex = '';
    for(let i = 0; i < str.length; i++) 
    {
        hex += str.charCodeAt(i).toString(16);
    }
    return hex;
}
extendString(str: string) 
{
  let extendedStr = '';
  let repeatCount = Math.floor(40 / str.length);
  
  for (let i = 0; i < str.length; i++) 
  {
      extendedStr += str[i].repeat(repeatCount);
  }
  
  // If the string is still not 40 characters long, append the first character until it is
  while (extendedStr.length < 40) 
  {
      extendedStr += str[0];
  }
  
  return extendedStr;
}
  stringToImg(hexString: string): string {
    if (hexString.toLowerCase().substring(0,2) == "0x")
    {
      hexString = hexString.substring(2,42);
    }
    else
    {
      hexString = this.stringToHex(hexString);
    }
    hexString = hexString.substring(0,40);
    if (hexString.length < 40) hexString = this.extendString(hexString); //Creates a more distinguishable image.

    const size = 64; // Upscale to 64x64
    const blockSize = 8; // Size of each block
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    let index = 0;
    for (let layer = 0; layer < size / 2; layer += blockSize) 
    {
      for (let i = layer; i < size - layer; i += blockSize) 
      {
        for (let j = layer; j < size - layer; j += blockSize) 
        {
          const redSeed = parseInt(hexString.slice(index % hexString.length, (index % hexString.length) + 2), 16);
          const greenSeed = parseInt(hexString.slice((index + 2) % hexString.length, (index + 4) % hexString.length), 16);
          const blueSeed = parseInt(hexString.slice((index + 4) % hexString.length, (index + 6) % hexString.length), 16);
          ctx!.fillStyle = `rgb(${redSeed},${greenSeed},${blueSeed})`; // Convert seeds to RGB color
          ctx!.fillRect(i, j, blockSize, blockSize); // Draw a block of color
          index += 6;
        }
      }
    }
    return canvas.toDataURL(); // Returns a base64 PNG of the image
  }

  isValidBase64(str: string) 
  {
    try 
    {
      const decodedString = atob(str); //TODO: Apparently atob and btoa are deprecated? // Decode the string
      const encodedString = btoa(decodedString);// Encode the decoded string
      return str === encodedString; // Check if the original string is equal to the encoded string
    } 
    catch (err) 
    {
      return false;// If there's an error in the try block, the string is not valid Base64
    }
  }



  defaultValues = {
    name: 'Loading...',
    description: 'Loading...',
    profileImg: "",
    bannerImg: ""
  };

  bannerImageString: string = ""; // Declare the variable for the banner image
  profileImageString: string = ""; // Declare the variable for the profile picture

  handleInputChange(e: any, imageType:string) //TODO: add checks to verify images uploaded are valid and correct. 
  {
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var pattern = /image-*/;
    var reader = new FileReader();
    if (!file.type.match(pattern)) 
    {
      alert('invalid format');
      return;
    }
    reader.onload = (e) => this._handleReaderLoaded(e, imageType);
    reader.readAsDataURL(file);
  }

  _handleReaderLoaded(e: any, imageType:string) 
  {
    let reader = e.target;
    var image_as_base64 = reader.result as string;
    //console.log(["image_as_base64", image_as_base64]);
    if (imageType == "profile") this.profile_form_variables.profileImg_b64 = image_as_base64;
    else if (imageType == "banner") this.profile_form_variables.bannerImg_b64 = image_as_base64;
    else throw Error("Bad Image Type");
  }

  clear_formboxes()
  {
    this.profile_form_variables.profileImg_b64 = "";
    this.profile_form_variables.bannerImg_b64 = "";
    this.profile_form_variables.description = "";
    this.profile_form_variables.displayName = "";    
    this.defaultValues.description = "";
    this.defaultValues.name = "";

    (<HTMLInputElement>document.getElementById("profileImg")!).value = "";
    (<HTMLInputElement>document.getElementById("bannerImg")!).value = "";
  }


  private web3js: any;
  public accounts: any; //TODO: make private? Needs to accessible in html?

  constructor(private toastr: ToastrService, private route: ActivatedRoute) 
  {
    this.profileData = this.emptyProfileData(); //Start with an empty profile

  }

  private modalService = inject(NgbModal);
	closeResult = '';

	open(content: TemplateRef<any>, canClose:boolean=true, windowClass:string="") 
  {
		this.modalService.open(content, 
      { 
        ariaLabelledBy: 'modal-basic-title',
        backdrop: (canClose ? true : 'static'),
        windowClass: windowClass
      }).result.then(
			(result: any) => {
				this.closeResult = `Closed with: ${result}`;
			},
			(reason: any) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			},
		);
	}

	private getDismissReason(reason: any): string 
  {
		switch (reason) 
    {
			case ModalDismissReasons.ESC:
				return 'by pressing ESC';
			case ModalDismissReasons.BACKDROP_CLICK:
				return 'by clicking on a backdrop';
			default:
				return `with: ${reason}`;
		}
	}

  async resetPage()
  {
    this.profileData = new Profile();
    //this.resetProfileData();
    //this.profileData["DisplayName"]  = ""; 
    //this.profileData["Description"] = "";
    //this.profileData["ProfileImage"] = exampleImage;
    //this.profileData["BannerImage"] = exampleImage;

    this.posts = []

    await this.actuallyStart()
  }

  

  checkFunc() //See following function for details.
  {
    setTimeout(
      () => //<== this is the magic that gives us a shared scope.
      {
        this.check.i++;

        if (this.check.sharedValue == 1)
        {
          //The other thread has finished.
        }
        else if (this.check.i <= this.check.max)
        {
          console.log("Waiting for metamask...", this.check.i);
          this.checkFunc(); //repeat the loop
        }
        else
        {
          if (this.check.sharedValue == -5)
          {
            //The other thread started, but failed to access Metamask.
            console.error("Metamask is broken. Please troubleshoot metamask.")
            this.toastr.error('Metamask did not respond. If you do not see a popup, please troubleshoot Metamask. If you see the Metamask popup, there is no problem.', 'Metamask Error', {timeOut: 30000});
          }
          else if (this.check.sharedValue == 1)
          {
            console.log("Metamask access succeeded.")
            //this.actuallyStart();
            //We will actually start in the metamask thread.
          }
          else
          {
            console.log(this.check.tmp);
            console.error("Unexpected error while accessing Metamask.")
            this.toastr.error('Unexpected error while accessing Metamask.', 'Error', {timeOut: 30000});
          }
        }
      }, 250
    )
  }

  check: any = {};
  doStartCheck()
  {
    var sharedValue = -1;
    console.log("Starting checker thread");

    this.check.i = 0;
    this.check.max = 25;
    this.check.sharedValue = -1;

    //Start the checker thread. We're using a function here so we can repeat it easily and keep the shared scope.
    this.checkFunc();


    //We need to do this because there is a chance that this function call will crash the main thread.
    //To work around this, we need to start 2 threads, one to do the risky call, and one to wait for it to finish.
    //Interestingly enough, try catch does NOT fix this.
    //This might be a brave browser specific bug, I have not explored further.
    console.log("Starting metamask thread.");
    setTimeout(async () => {
      try
      {
        console.log("A");
        this.check.sharedValue = -5;
        console.log("sdfg");
        var test = await window.ethereum._metamask.isUnlocked(); //TODO: Change - MetaMask: 'ethereum._metamask' exposes non-standard, experimental methods. They may be removed or changed without warning.
        console.log(["test", test])
        var tmp = await window.ethereum.request({method: 'eth_requestAccounts'});

        this.web3js = new Web3(window.ethereum);
        console.log("B");
        this.check.sharedValue = 1;
        console.log(["tmp", tmp]);
        this.actuallyStart();
      }
      catch (e)
      {
        this.check.sharedValue = -2;
        console.error(e);
      }
      
    }, 1000);
  }

  posts: Post[] = [];

  
  async getMetadata(blockIds: number[]): Promise<any[]> //TODO: examine performance here. Needs optimization?
  {
    if (blockIds.length == 0)
    {
      this.toastr.error("Error fetching metadata. Does this profile exist?");
      //throw "Profile empty.";
      return []
    }

    type retType = [number, any]
    var ret: retType[] = [];

    for (var i = 0; i < blockIds.length; i++) 
    {
      var blockId = blockIds[i];
      if (blockId == 0) continue; //Blockid = 0, might happen during testing, but never in deployment. 0 mean empty.
      var block = await this.web3js.eth.getBlock(blockId, true);
      var timestamp = block.timestamp;
      var humanReadableTimestamp = new Date(Number(timestamp) * 1000);
      console.log(["block", block]);
      var transactions = block.transactions;
      if (transactions == null) continue;
      for (var j = 0; j < transactions.length; j++)
      {
        var tx_tmp = transactions[j];
        if ("to" in tx_tmp && tx_tmp["to"] !== null && tx_tmp["to"].toLowerCase() === this.contractAddress.toLowerCase())
        {
          //Do nothing, this is ours.
        }
        else
        {
          console.log("Not related to our contract, skipping.");
          continue;
        }
        var tx = transactions[j]["hash"];
        var tx2 = await this.web3js.eth.getTransactionReceipt(tx);

        var type = this.fetch_abi_type("Metadata")
        if (type == -1) throw new Error('Error in abi!');

        for (var k = 0; k < tx2.logs.length; k++)
        {
          try
          {

            console.log(["metadata", tx2,
            abi[type].inputs,
            tx2.logs[k].data,
            tx2.logs[k].topics])
            var metadata = this.web3js.eth.abi.decodeLog(
              abi[type].inputs,
              tx2.logs[k].data,
              tx2.logs[k].topics
              );
              console.log(["Metadata[k][2]", metadata[2]]);
              ret.push([blockId, metadata]);
            }
            catch (e)
            {
              console.error(e);
              //TODO: this throws an exception at transaction hash 0x66e02322cefb18873c65cbb7b777bb822c031b0e71f32dfcf4701e0b64ed1339
            }
          }
      }
    }

    return ret;
  }

  fetch_abi_type(name: string, type: string = "event", match_lowercase: boolean = true)
  {
    for (var i = 0; i < abi.length; i++)
    {
      if (match_lowercase)
      {
        if (abi[i].type.toLowerCase() != type.toLowerCase()) continue;
        if (abi[i].name.toLowerCase() == name.toLowerCase()) return i;
      }
      else
      {
        if (!match_lowercase && abi[i].type != type) continue;
        if (!match_lowercase && abi[i].name == name) return i;
      }
    }
    return -1; //Not found
  }

  async wait_for_txhash(txHash: string): Promise<number>
  {
    let test: number = await new Promise((resolve, reject) => 
      {
        let intervalId = setInterval(async () => 
        {
            // Replace 'checkCondition()' with your actual check
            try
            {
              let check: any = await this.eth_getTransactionByHash(txHash)
              console.log(["check", check]);
          
              if(check) 
              {
                  console.log("Check is true, stopping interval.");
                  clearInterval(intervalId);
                  if (check["input"]?.length >= 10) 
                  // 0x -> 2 chars
                  // 8 chars defines the function
                  // The remaining characters get complicated, the remaining sets of 64 characters (32 bytes) create the data structure then holds the actual data.
                  // Since the primary call here is DoPost, there will be 2 string inputs. Because of how strings are encoded, there will be (at least) 3 lines of 32 bytes per input.
                  // Therefore, there will be 2x3x64 + 2 + 8 hex characters here. At minimum 394 hex characters.
                  // However, since this is a generic function, the bare minimum number of characters we will have here will be 2+8 hex characters (0x + 8 function characters). Assuming no input parameters.
                  {
                    resolve(check["input"]?.length) //Successful
                  }
                  else
                  {
                    reject(0) //I dont know what could go wrong here, but something failed.
                  }
              } 
              else 
              {
                  console.log("Running check...");
              }
            }
            catch(e)
            {
              console.error(["getting txHash", e]);
              reject(-1) //Some exception was thrown. Most likely something failed, potentially node connection issue.
            }
            
        }, 2500);
      
      }) // >0 => success. 0 => weird error happened. -1 => exception was thrown.
      
      console.log(["test", test]);
      return test;
  }

  async eth_getTransactionReceipt(txhash:string)
    {
      var tmp = {
        "jsonrpc": "2.0",
        "method": "eth_getTransactionReceipt",
        "params": [txhash],
        "id": 1
      }

      //Supposedly we should be using request here, but it doesnt work.
      var ret: any = await new Promise((resolve, reject) => {
        this.web3js.currentProvider.sendAsync(tmp, (err: any, result: any) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            console.log(result);
            resolve(result);
          }
        });
      });
      
      return ret.result;
    }

  async wait_for_txReceipt(txHash: string): Promise<number>
  {
    let test: number = await new Promise((resolve, reject) => 
      {
        let intervalId = setInterval(async () => 
        {
            // Replace 'checkCondition()' with your actual check
            try
            {
              let check: any = await this.eth_getTransactionReceipt(txHash)
              console.log(["check", check]);
          
              if(check) 
              {
                  console.log("Check is true, stopping interval.");
                  clearInterval(intervalId);
                  var len = check?.["logs"]?.[0]?.["data"].length;
                  if (len >= 130) 
                  //For the most part, this is similar to the txhash wait function.
                  // 0x -> 2 chars
                  //I forget what the first 32 bytes represents here.
                  //Since there are two parameters, the next 2x32 bytes point to the lines containing the start of the string.
                  //The lines pointed to, define the number of bytes (starting from the left) to look for characters for the string. Rounded up to the nearest interval of 32 bytes.
                  //So the number of chars = 2 + 2*32x + the sum of each bytes in the strings. Where x is the number of strings.
                  //Sine this function will be primarily used for checking completion of postings, we will look for at least 2*64+2 characters.
                  //In general, if the function take any input at all, look for more than 2 characters.
                  //If the function takes NO parameters, look for 2 characters ("0x")
                  {
                    resolve(len) //Successful
                  }
                  else
                  {
                    reject(0) //I dont know what could go wrong here, but something failed.
                  }
              } 
              else 
              {
                  console.log("Running check...");
              }
            }
            catch(e)
            {
              console.error(["getting txHash", e]);
              reject(-1) //Some exception was thrown. Most likely something failed, potentially node connection issue.
            }
            
        }, 2500);
      
      }) // >0 => success. 0 => weird error happened. -1 => exception was thrown.
      
      console.log(["test", test]);
      return test;
  }

  async eth_sign_and_send(from:string, to:string, data:string) //eth_sendTransaction
    {
      var tmp = {
        "jsonrpc": "2.0",
        "method": "eth_sendTransaction",
        "params": [
          {
            "from": from,
            "to": to,
            //"gas": "0xffffffffffffffff",
            //"gasPrice": "0xfffffffffffffffffff",
            "value": "0x0",
            "data": data
          },
          "latest"
        ],
        "id": 1
      }

      
      var ret: any = await new Promise((resolve, reject) => {
        this.web3js.currentProvider.sendAsync(tmp, (err: any, result: any) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            console.log(result);
            resolve(result);
          }
        });
      });
      
      return ret.result;
    }

    async eth_call(from:string, to:string, data:string)
    {
      var tmp = {
        "jsonrpc": "2.0",
        "method": "eth_call",
        "params": [
          {
            "from": from,
            "to": to,
            //"gas": "0xffffffffffffffff",
            //"gasPrice": "0xfffffffffffffffffff",
            "value": "0x0",
            "data": data
          },
          "latest"
        ],
        "id": 1
      }

      console.log(["eth_call", tmp])

      //Supposedly we should be using request here, but it doesnt work.
      var ret: any = await new Promise((resolve, reject) => {
        this.web3js.currentProvider.sendAsync(tmp, (err: any, result: any) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            console.log(result);
            resolve(result);
          }
        });
      });
      
      return ret.result;
    }
    
    async eth_feeHistory(numBlocks:number = 10, staringBlock:string = "pending", percentiles: Array<number> = [25,50,75])
    {
      var tmp = {
        "jsonrpc": "2.0",
        "method": "eth_feeHistory", //https://www.chainnodes.org/docs/ethereum/eth_feeHistory
        "params": [
          numBlocks,
          staringBlock,
          percentiles
        ],
        "id": 1
      }

      console.log(["eth_feeHistory", tmp])

      //Supposedly we should be using request here, but it doesnt work.
      var ret: any = await new Promise((resolve, reject) => {
        this.web3js.currentProvider.sendAsync(tmp, (err: any, result: any) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            console.log(result);
            resolve(result);
          }
        });
      });
      
      return ret.result;
    }

    async estGasPrice()
    {
      console.log(["estGasPrice"])
      let numBlocks = 10;
      const percentiles = [25,50,75]


      let feeHistory = await this.eth_feeHistory(numBlocks, "pending", percentiles); //TODO: add error handling
      let avgGas = 0
      let avgCounter = 0;
      numBlocks = feeHistory["reward"].length; //In very rare cases (maybe only testing?) less blocks may be returned.

      for (let i = 0; i < numBlocks; i++)
      {
        for (let j = 0; j < percentiles.length; j++)
        {
          try
          {
            if (!("reward" in feeHistory)) continue;
            if (feeHistory["reward"] === undefined || feeHistory["reward"].length == 0) continue;
            var tmp1 = Number(feeHistory["reward"][i][j]*percentiles[j])
            var tmp2 = Number(percentiles[j]);
            if (tmp1 <= 5) continue; //Note: This is 5 WEI. 5x10^-18 coins. This is mostly to avoid ruining the weighted average.
            avgGas += tmp1
            avgCounter += tmp2
            
            console.log(["estGasPrice", tmp1, tmp2, avgGas, avgCounter])
          }
          catch (e)
          {
            console.error(["estGasPrice", i,j,e]);
          }
        }
      }
      avgGas /= avgCounter; //Weighted average.

      let avgBaseFee = 0
      for (let i = 0; i < numBlocks; i++) avgBaseFee += Number(feeHistory["baseFeePerGas"][i])
      avgBaseFee /= feeHistory["baseFeePerGas"].length;
      
      if (isNaN(avgGas + avgBaseFee)) return 0;

      return avgGas + avgBaseFee; //Approximate gas price. Multiply by gas used to estimate coin price. (after unit conversion. Divide by 1000000000)
    }

    async eth_estimateGas(from:string, to:string, data:string)
    {
      var tmp = {
        "jsonrpc": "2.0",
        "method": "eth_estimateGas",
        "params": [
          {
            "from": from,
            "to": to,
            //"gas": "0xffffffffffffffff",
            //"gasPrice": "0xfffffffffffffffffff",
            "value": "0x0",
            "data": data
          },
          "latest"
        ],
        "id": 1
      }

      //Supposedly we should be using request here, but it doesnt work.
      var ret: any = await new Promise((resolve, reject) => {
        this.web3js.currentProvider.sendAsync(tmp, (err: any, result: any) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            console.log(result);
            resolve(result);
          }
        });
      });
      
      return ret.result;
    }

    async eth_getTransactionByHash(txhash:string)
    {
      var tmp = {
        "jsonrpc": "2.0",
        "method": "eth_getTransactionByHash",
        "params": [txhash],
        "id": 1
      }

      //Supposedly we should be using request here, but it doesnt work.
      var ret: any = await new Promise((resolve, reject) => {
        this.web3js.currentProvider.sendAsync(tmp, (err: any, result: any) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            console.log(result);
            resolve(result);
          }
        });
      });
      
      return ret.result;
    }

   async getNonce() //This is specifically the nonce in the contract, not the wallet.
   {
    this.accounts = await this.web3js.eth.getAccounts(); 

    const contract = new this.web3js.eth.Contract(abi, this.contractAddress);
    var tmp = contract.methods.getNonce(this.tag);
    var encoded = await this.eth_call(this.accounts[0], this.contractAddress, tmp.encodeABI());
    console.log(["getNonce", encoded])
    if (encoded == "0x") return 0;
    var ret_tmp = this.web3js.eth.abi.decodeParameters(['uint256'], encoded);
    var nonce = ret_tmp[0];
    return Number(nonce);
   }

   async getVersion() //This is specifically the nonce in the contract, not the wallet.
   {
    this.accounts = await this.web3js.eth.getAccounts(); 

    const contract = new this.web3js.eth.Contract(abi, this.contractAddress);
    var tmp = contract.methods.getVersion();
    var encoded = await this.eth_call(this.accounts[0], this.contractAddress, tmp.encodeABI());
    console.log(["getVersion", encoded])
    if (encoded == "0x") return 0;
    var ret_tmp = this.web3js.eth.abi.decodeParameters(['uint256'], encoded);
    var nonce = ret_tmp[0];
    return Number(nonce) / 1000; //The version is an integer, so we divide by 1000.
   }


   async getLastNBlocks(n: number, offset: number = 0) //Get the blocks with post data (from last to last-n)
   {
    this.accounts = await this.web3js.eth.getAccounts(); 

    const contract = new this.web3js.eth.Contract(abi, this.contractAddress);
    var tmp = contract.methods.getLastNBlocks(this.tag, n, offset);
    var encoded = await this.eth_call(this.accounts[0], this.contractAddress, tmp.encodeABI());
    if (encoded == "0x") return [];
    var ret_tmp = this.web3js.eth.abi.decodeParameters(['uint256[]'], encoded);
    //var ret = ret_tmp[0];
    var ret = [...ret_tmp[0]]; // create a new array and copy the values from ret_tmp
    //convert all bigints to numbers
    for (var i = 0; i < ret.length; i++)
    {
      ret[i] = Number(ret[i]);
    }

    return ret;
   }

   async getFirstNBlocks(n: number, offset: number = 0) // Opposite of above. Get first to n blocks with posts.
   {
    this.accounts = await this.web3js.eth.getAccounts(); 

    const contract = new this.web3js.eth.Contract(abi, this.contractAddress);
    var tmp = contract.methods.getFirstNBlocks(this.tag, n, offset);
    var encoded = await this.eth_call(this.accounts[0], this.contractAddress, tmp.encodeABI());
    if (encoded == "0x") return [];
    var ret_tmp = this.web3js.eth.abi.decodeParameters(['uint256[]'], encoded);
    //var ret = ret_tmp[0];
    var ret = [...ret_tmp[0]]; // create a new array and copy the values from ret_tmp
    //convert all bigints to numbers
    for (var i = 0; i < ret.length; i++)
    {
      ret[i] = Number(ret[i]);
    }

    return ret;
   }

   async getBulkMetadata(owner: string, metadataIDs: Array<string>) //Get the metadata in batches.
   {
    this.accounts = await this.web3js.eth.getAccounts(); 

    const contract = new this.web3js.eth.Contract(abi, this.contractAddress);
    var tmp = contract.methods.getBulkMetadata(owner, metadataIDs);
    var encoded = await this.eth_call(this.accounts[0], this.contractAddress, tmp.encodeABI());
    if (encoded == "0x") return [];
    var ret_tmp = this.web3js.eth.abi.decodeParameters(['uint256[]'], encoded);
    console.log(["getBulkMetadata", ret_tmp]);

    var ret = [...ret_tmp[0]]; // create a new array and copy the values from ret_tmp
    //convert all bigints to numbers
    for (var i = 0; i < ret.length; i++)
    {
      ret[i] = Number(ret[i]);
    }

    return ret;
   }

   profile_form_variables = { //Unfortunately, files are not handled very cleanly in forms.
    displayName: "Enter your name here",
    description: "",
    bannerImg_b64: "",
    profileImg_b64: ""
  }

   async SubmitMetadata(form: NgForm)
   {
    console.log(["form", form]);
    console.log(["this.profile_form_variables", this.profile_form_variables])
    this.profile_form_variables.description  = form.value.description;
    this.profile_form_variables.displayName  = form.value.username;
    console.log(["this.profile_form_variables", this.profile_form_variables])

    var ids = []
    var datas = []

    if (this.profile_form_variables.description != "")
    {
      ids.push("2");
      datas.push(this.profile_form_variables.description)
      console.log("Pushing Description to blockchain.")
    }

    if (this.profile_form_variables.displayName != "")
    {
      ids.push("1")
      datas.push(this.profile_form_variables.displayName)
      console.log("Pushing DisplayName to blockchain.")
    }

    if(this.profile_form_variables.profileImg_b64 != "")
    {
      ids.push("3")
      datas.push(this.profile_form_variables.profileImg_b64)
      console.log("Pushing ProfileImg to blockchain.")
    }

    if (this.profile_form_variables.bannerImg_b64 != "")
    {
      ids.push("4")
      datas.push(this.profile_form_variables.bannerImg_b64)
      console.log("Pushing BannerImg to blockchain.")
    }

    //TODO: Add some better UX here to tell the user exactly what's going to be updated. Maybe a simple confirm button with preview data?

    //The ids and datas are equal size arrays. 
    //1 => Display Name
    //2 => Description
    //3 => Profile Image (Base64)
    //4 => Banner Image (Base64)
    //Any number of ids can be used here.
    //The above are not fixed in the contract, more can be specified later. It is up to the ui to make use of them.
    await this.setBulkMetadata(ids, datas);
    
    //under normal circumstances we'd just close the modal. However, I'm going to be lazy and just refresh the page. Kill two birds with one stone.
    location.reload()
   }

   //This function is left here for reference. We are not using it because we have the bulk option.
   //Experimentally, using the bulk version for single operations adds 1500 gas to the potential operation. (3% increase)
   //In the worst case scenario of ethereum, this would add 14 cents to the total cost. However, if you're using ethereum, you're either stupid or like burning money.
   //Ethereum is not feasible for this type of contract. On Polygon, it would add 0.005 cents per transaction.
   // async setMetadata(metadataID: string, data: string)
   // {
   //   this.accounts = await this.web3js.eth.getAccounts();
   //   var myAccount = this.accounts[0];
 
   //   const contract = new this.web3js.eth.Contract(abi, address);
   //   var tmp = contract.methods.setMetadata(myAccount, metadataID, data);
 
   //   var encoded = await this.eth_call(myAccount, address, tmp.encodeABI());
   //   console.log(["encoded", encoded]);
   //   var ret_tmp = this.web3js.eth.abi.decodeParameters([], encoded);
   //   console.log(["ret_tmp", ret_tmp]);
   // }


  TmpPost: any = {
    counter: 0,
    imgs: [],
    msg: "",
    preview: [],
    coinCost: 0,
    gasEst: 0
  }

  posting_disabled = false;

  async DoPost_btn(form: any) //Called from ui when trying to post.
  {
    //Generate the final text
    var tmp = this.TmpPost.msg;
    for (let i in this.TmpPost.imgs)
    {
      tmp = tmp.replaceAll(`<Image-${i}>`, `
--- START IMAGE ---
${this.TmpPost.imgs[i]}
--- END IMAGE ---
`.trim())
    }
    //In the user message, images are stored at <Image-#>
    //On the blockchain, images are stored as base64 in the format above.
    var final_post = tmp;
    console.log(["final_post", final_post])

    await this.doPost(this.tag, final_post);
  }

  async waitXSeconds(x: number): Promise<void> 
  {
    let intervalId: NodeJS.Timeout | undefined;
    return new Promise((resolve) => 
    {
      try 
      {
        intervalId = setInterval(() => 
        {
          console.log("Waiting...");
        }, 1000);
 
        setTimeout(() => 
        {
          clearInterval(intervalId!);
          resolve();
        }, x * 1000);
      } 
      catch (error) 
      {
        //TODO: add action on error?
      } 
      finally 
      {
        if (intervalId !== undefined) 
        {
          clearInterval(intervalId);
        }
      }
    });
  }

  async doPost(tag: string, msg: string)
  {
    try
    {
      this.accounts = await this.web3js.eth.getAccounts();
      var myAccount = this.accounts[0];
      
      const contract = new this.web3js.eth.Contract(abi, this.contractAddress);
      
      this.toastr.info("Posting. Please wait...") //TODO: Add more details?
      
      var tmp = contract.methods.DoPost(tag, msg);
      
      console.log(["doPost tmp", tmp])
      var gasEst = await this.eth_estimateGas(myAccount, this.contractAddress, tmp.encodeABI());
      console.log(["gasEst", gasEst]);
      
      var txHash = await this.eth_sign_and_send(myAccount, this.contractAddress, tmp.encodeABI());
      var res: number = await this.wait_for_txReceipt(txHash); 
      
      
      if (res <= 0) this.toastr.error("Posting failed. Please review Metamask or blockchain explorer.");
      if (res > 0) this.toastr.success("Posting successful. Reloading...");
      
      await this.waitXSeconds(5); //Allow 5 seconds for the blockchain to finish updating.
      if (res > 0) location.reload()
    }
    catch (e)
    {
      this.toastr.error("Failed to post. See console for details.")
      console.error(e);
      //TODO: Add error handling for contract based rejects. Current options:
      //Not authorized
      //Requested more elements than available
      //toAddress_outOfBounds
      //Bad input. Size mismatch.

    }
  }

  AddImageToPost_isRunning = false;
  AddImageToPost(e: any) {
    this.posting_disabled = true;
    this.AddImageToPost_isRunning = true;

    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var pattern = /image-*/;
    var reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }
    reader.onload = (e) => this._AddImageToPost(e);
    reader.readAsDataURL(file);
  }

  _AddImageToPost(e: any) {

    let reader = e.target;
    var image_as_base64 = reader.result as string;
    console.log(["image_as_base64", image_as_base64]);
    this.TmpPost.imgs.push(image_as_base64);
    console.log(["TmpPost", this.TmpPost]);
    this.posting_disabled = false;
  }

  clearTmpPost()
  {
    //This simply replaces the object.
    this.TmpPost = {
      counter: 0,
      imgs: [],
      msg: "",
      preview: []
    };
  }


  bPreviewMissingImage = false;
  async generatePreview()
  {
    this.bPreviewMissingImage = false;
    var tmp = this.TmpPost.msg;
    for (let i in this.TmpPost.imgs)
    {
      console.log(["bPreviewMissingImage", !this.bPreviewMissingImage, !tmp.includes(`<Image-${i}>`)])
      if (!this.bPreviewMissingImage && !tmp.includes(`<Image-${i}>`)) this.bPreviewMissingImage = true;
      tmp = tmp.replaceAll(`<Image-${i}>`, `
--- START IMAGE ---
${this.TmpPost.imgs[i]}
--- END IMAGE ---
`.trim())
    }
    this.TmpPost.preview = this.parseData(tmp);
    console.log(["this.TmpPost.preview", this.TmpPost.preview])

    const contract = new this.web3js.eth.Contract(abi, this.contractAddress);
    var tmp_call = contract.methods.DoPost(this.tag, tmp);
    var gasEst = await this.eth_estimateGas(this.accounts[0], this.contractAddress, tmp_call.encodeABI());
    //TODO: If the gas limit exceeds the block limit, we will get { "code": -32000, "message": "gas required exceeds allowance (29276135)", "cause": null }. Need to handle this, this means the content cannot be posted.
    this.TmpPost.coinCost = (gasEst * this.gasPrice) / 1000000000;
    this.TmpPost.gasEst = Number(gasEst)
    //TODO: Add method to find gas limit for block and add warning if over.
  }

  addImageTextToPost(i: number) //The user sees <Image-#> instead of the base64, when you click the corresponding image, <Image-#> gets added to the message.
  {
    this.TmpPost.msg += `\n<Image-${i}>\n`
  }

  async setBulkMetadata(metadataIDs: string[], datas: string[])
  {
    this.accounts = await this.web3js.eth.getAccounts();
    var myAccount = this.accounts[0];

    const contract = new this.web3js.eth.Contract(abi, this.contractAddress);
    var tmp = contract.methods.SetBulkMetadata(myAccount, metadataIDs, datas)

    console.log(["setBulkMetadata tmp", tmp])
    var encoded = await this.eth_sign_and_send(myAccount, this.contractAddress, tmp.encodeABI());
    console.log(["encoded", encoded]);
    var ret_tmp = this.web3js.eth.abi.decodeParameters([], encoded);
    console.log(["ret_tmp", ret_tmp]);
  }


  tmp_parsed: Array<DataBlock> = [];
  parseData(input: string)
  {
    const START_TXT = "--- START IMAGE ---"
    const END_TXT = "--- END IMAGE ---"

    let ret = new Array<DataBlock>()

    let counter = 0;

    //let tmp = input;
    let currentIndex = 0;
    var end = 0;
    var tmp = "";
    while (true) 
    {
      if (counter > 30) break; //We limit the number of blocks here to prevent abuse.
      currentIndex = end;
      var start = input.indexOf(START_TXT, currentIndex+1)
      end = input.indexOf(END_TXT, currentIndex+1)
      if (start === -1 && end !== -1)
      {
        
      }
      if (end === -1 || start === -1) {
        ret.push({
          type: 'TEXT',
          data: input.substring(currentIndex, input.length).replaceAll(END_TXT, "").trim(),
      })
    break;
      };
      //ret.push(new DataBlock())
      tmp = input.substring(currentIndex, start).replaceAll(END_TXT, "").trim();
      if (tmp.trim() !== "")
        ret.push({
            type: 'TEXT',
            data: tmp,
        })
      tmp = input.substring(start + START_TXT.length, end).trim();
      if (tmp.trim() !== "")
        ret.push({
            type: 'IMAGE',
            data: tmp,
        })
      counter += 1;
    }
    console.log(["RET", ret]);
    this.tmp_parsed = ret;
    return ret;
  }

  findAllIndicesOfSubstring(str: string, search: string): number[] 
  {
      const indices: number[] = [];
      let currentIndex = str.indexOf(search);
      while (currentIndex !== -1) 
      {
          indices.push(currentIndex);
          currentIndex = str.indexOf(search, currentIndex + 1);
      }
      return indices;
  }

  setCookie(name: string, value: string, days: number) 
  {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
  }
  getCookie(name: string) 
  {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
  }
}

/*
//===Webapp===
//TODO: store already loaded posts in local storage/indexdb?
//TODO: Uploading only the banner causes the profile picture to get removed.
//TODO: this.getMetadata is not actually getting historical data. This isnt an issue, but it might be a symptom of a different problem. 
//TODO: Updating profile metadata should estimate cost like DoPost
//TODO: Updating profile metadata should refesh the page after waiting for the block to be mined like DoPost.
//TODO: add error handling for images.
//TODO: Add pagination to post loading
//TODO: _ at the end of the tag does not display as not a user page.
//TODO: add bar to the top of a post that adds display name and wallet address. Maybe profile/banner image as well?
//TODO: When the user changes wallet address in metamask, we need to reload the user profile.
//TODO: Add an option to click on the wallet image and go to their profile?
//TODO: Support markdown
//TODO: Add option to view specific post? (using postIdToBlockNum)
//TODO: Add support for IPFS images?

//===Smart Contract===
//TODO: Support hashtags?
//TODO: Support handles?
//TODO: Add
*/