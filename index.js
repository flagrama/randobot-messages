'use strict';

const config = require('./auth.json');
const Discord = require('discord.js');
const request = require('request-promise');
var duplicateCD = false;
var cooldown = false;

//Queue System
var maxPatchJobs = 2;
var activePatchJobs = 0;
var patchJobQueue = [];
//

const bot = new Discord.Client();
const ootrBotToken = config.token;
const botType = "master";
const ootrServerID = config.serverID;

var botIsReady = false;
bot.on('ready', () => {
	console.log('Logged in as %s - %s\n', bot.user.username, bot.user.id);

	botIsReady = true;
	/*var VoiceJoin = setTimeout(() => {
		bot.guilds.get(ootrServerID).channels.get(ootrVoiceCommentaryChannelID).join()
	}, 5000);*/
});

bot.on('error', () => {
	console.log("The bot encountered a connection error!!");

	botIsReady = false;

	setTimeout(() => {

		bot.login(ootrBotToken);
	}, 10000);
});

bot.on('disconnect', () => {
	console.log("The bot disconnected!!");

	botIsReady = false;

	setTimeout(() => {

		bot.login(ootrBotToken);
	}, 10000);
});

bot.on('message', message => {
	if (["RandoBot", "RandoBot2"].includes(message.author.username))
		return;
	if (botType == "master") {
		if (message.content.startsWith("Sex Dating > http://") || message.content.includes("discord.amazingsexdating.com")) {
			bot.guilds.get(ootrServerID).ban( message.author, {days: 7, reason: "Sex Dating Bot, auto banned by RandoBot!" })
			.then(log.info("Sex Dating Bot banned! Username: " + message.author.tag))
			.catch(error => log.info("Couldn't ban bot because of the following error: \n" + error));
		}
		if (message.content.startsWith("Best Casino Online > http://") || message.content.includes("gambldiscord.bestoffersx.com")) {
			bot.guilds.get(ootrServerID).ban( message.author, {days: 7, reason: "Betting Site Bot, auto banned by RandoBot!" })
			.then(log.info("Betting Site Bot banned! Username: " + message.author.tag))
			.catch(error => log.info("Couldn't ban bot because of the following error: \n" + error));
		}
		if (message.content.includes("I'm going to say the N Word!")) {
			bot.guilds.get(ootrServerID).ban( message.author, {days: 7, reason: "Spam Bot, auto banned by RandoBot!" })
			.then(log.info("Spam bot Username: " + message.author.tag))
			.catch(error => log.info("Couldn't ban bot because of the following error: \n" + error));
		}
		if (!message.member && message.content.startsWith("!")) {
			message.reply("Your server membership data is corrupt. Please try again in a few minutes. If this message pops up again, please leave the server and rejoin shortly after: <https://discord.gg/kwgUPPk>");
			log.info("Broken message object detected - User: " + message.author.tag + " - Object: " + message);
			bot.guilds.get(ootrServerID).fetchMembers()
				.then(log.info("Refetched Server members"));
			return;
		}
	}
	var userToMention;
	if (message.mentions.members) {
		if (message.mentions.members.size == 1)
			userToMention = message.mentions.members.first();
	}
	var mention = "";
	if (userToMention != null) {
		mention = "<@" + userToMention.id + "> \n";
	}
	if (botType == "master") {
		if (!duplicateCD) {
			if ((message.content.toLowerCase() === "!commands") || (message.content.toLowerCase() === "!help")) {
				var commandList = ["!readme","!changelog","!rom","!source","!python","!mac","!dev","!macdev","!version","!latest","!winerror","!sim","!vc","!ImNew","!pj64","!compress","!logic","!vanilla","!routing","!log","!progressive","!hash","!hints","!models","!mastersword","!beans","!letter","!shufflemedallions","!tricks","!tricksnmg","!bosses","!bait","!scrubs","!racing","!multiworld","!4.0","!glitchlogic","!entrancerando","!crossover","!lowpriority"];
				var commandsMessage = "User Commands for all channels: \n";
				var count = 1;
				commandList.forEach((command,index) => {
					count++;
					if (count % 5 != 0)
						commandsMessage = commandsMessage + command + " | ";
					else commandsMessage = commandsMessage + command + " \n";
				})
				commandsMessage = commandsMessage.slice(0,-2);
				message.reply(commandsMessage);
			}
			if (message.content.toLowerCase().startsWith("!rom")) {
				message.channel.send(mention + "I wonder if this could be helpful...", {
					file: codeImage
				}).then(() => {
					message.channel.send("Reminder: _Google_ is a **verb**. \nA verb is a word used to describe an **action**, **state**, or **occurrence**, and forming the main part of the predicate of a sentence, such as hear, become, happen.")
				});
				_cooldown();
				return;
			}
			if (message.content.toLowerCase().startsWith("!source")) {
				message.channel.send(mention + "The OoT Item Randomizer is open source - you can find the source code and compiled releases of version 3.0 at https://github.com/AmazingAmpharos/OoT-Randomizer \nNote that seeds generated from source code will differ from release seeds.");
				_cooldown();
				return;
			}
			if (message.content.toLowerCase().startsWith("!dev") && !message.content.toLowerCase().startsWith("!devmac")) {
				_devVersionCheck(function(version){
					let link_version = version.split(" ")[0];
					message.channel.send(mention + "__**How to acquire and install the Dev Branch Randomizer for access to the newest features**__ (latest version is v" + version + " and might be unstable): \n__Step 1__: Download Python 3.7.0 <https://www.python.org/downloads/> Hit the yellow Download button. Then proceed to install Python. \nWhen installing Python, choose ``Customize installation`` and make sure to check \n- ``Add to PATH`` \n- ``Install Tkinter and IDLE`` \n- ``Add to environment variables`` \n__Step 2__: The dev branch of OoTR is available at: \n<https://github.com/TestRunnerSRL/OoT-Randomizer/releases/tag/" + link_version + "> \nHit the link that says `Source code (zip)` \n__Step 3__: Extract/Unzip the `OoT-Randomizer-" + link_version + " folder` out of the zip file to your desktop or wherever you desire. Just make sure to unzip it. \n__Step 4__: Double-click the `Gui.py` it may say just say `Gui` - Again just double-click that file to start up the randomizer interface. \n__Step 5__: Enjoy, all the different options have tooltips. To see them just hover your mouse over them.");
				});
				_cooldown();
				return;
			}
			if (message.content.toLowerCase().startsWith("!mac") && !message.content.toLowerCase().startsWith("!macdev")) {
				message.channel.send(mention + 'You can find the **Mac release** of OoTR on Github: <https://github.com/AmazingAmpharos/OoT-Randomizer/releases/tag/v3.0>');
				_cooldown();
				return;
			}
			if (message.content.toLowerCase().startsWith("!version")) {
				message.channel.send(mention + 'Please include the specific platform (Desktop/Web) and build version number when asking for setup help or reporting a potential bug. Without it, people will be unable to track down the issue.');
				_cooldown();
				return;
			}
			if (message.content.toLowerCase().startsWith("!latest")) {
				_devVersionCheck(function(version){
					let link_version = version.split(" ")[0];
					message.channel.send(mention + 'The latest dev version is v' + version + ' - find the source code on <https://github.com/TestRunnerSRL/OoT-Randomizer/releases/tag/' + link_version + '>');
				});
				_cooldown();
				return;
			}
			if (message.content.toLowerCase().startsWith("!macdev") || message.content.toLowerCase().startsWith("!devmac")) {
				message.channel.send(mention + '__**How to acquire and install the Dev Branch Randomizer on macOS:**__\n__Step 1__: Open Terminal in Finder. It can be found in Applications -> Utilities -> Terminal \n__Step 2__: Install ``brew``.  Copy and paste the following in Terminal: ``/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`` and press Enter. \n__Step 3__: Install ``python3`` and ``git`` with the command: ``brew install python3 git`` \n__Step 4__: Clone the OoTR Dev-Branch: \n``git clone -b Dev https://github.com/TestRunnerSRL/OoT-Randomizer.git`` \n__Step 5__: Change working directory to the OoT-Randomizer folder with: ``cd OoT-Randomizer`` \n__Step 6__: Open the randomizer with: ``python3 Gui.py`` \n__Step 7__: Enjoy, all the different options have tooltips. To see them just hover your mouse over them. \n\n__**How to update the OoT-Randomizer:**__ \n__Step 1__: Open Terminal. Change working directory to the OoT-Randomizer folder with: ``cd OoT-Randomizer`` \n__Step 2__: Pull the latest changes using git with:  ``git pull``');
				_cooldown();
				return;
			}
			if (message.content.toLowerCase().startsWith("!sim")) {
				message.channel.send(mention + "scatter wrote an OoTR simulator that allows you to 'play' through a seed by clicking links to check individual locations. Upload a tournament fork or 3.0 spoiler log and rush through all of Hyrule faster than atz! \nhttp://scatter.live/zootr-sim/");
				_cooldown();
				return;
			}
			if (message.content.toLowerCase().startsWith("!changelog")) {
				message.channel.send(mention + 'OoTR 4.0 Changelog: <https://github.com/TestRunnerSRL/OoT-Randomizer/tree/Dev#changelog>');
				_cooldown();
				return;
			}
			
			if (message.content.toLowerCase().startsWith("!logic")) {
				message.channel.send(mention + 'Logic is what the randomizer uses to ensure every seed is beatable without using major glitches or sequence breaks. \nFinding an item "out of logic" means that the path intended by the randomizer was broken in some way, and the item was obtained earlier than it was supposed to be found.');
				_cooldown();
				return;
			}
			if (message.content.toLowerCase().startsWith("!log") || message.content.toLowerCase().startsWith("!lawg")) {
				message.channel.send(mention + "Playing OoTR and wanna get out of the prologue? Well...", {
					file: spoilerImage
				});
				_cooldown();
				return;
			}
			if (message.content.toLowerCase().startsWith("!imnew")) {
				message.channel.send(mention + "Your first step should be visiting <#438699704080007200> - in there, there's a very detailed video dealing with what you have to do to set up the OoT Item Randomizer. Watch the video completely and carefully. Also contained in resources, you can find links to everything else you will need to play, as well as additional guides to get things set up. If, after all that, you still require some help, feel free to ask specific questions in <#476723801032491008>.");
				_cooldown();
				return;
			}
			if ((message.content.toLowerCase().startsWith("!tricks")) && (!message.content.toLowerCase().startsWith("!tricksnmg"))) {
				message.channel.send(mention + "This will be helpful: \nhttps://www.youtube.com/watch?v=jvlZ4Z6yfdY");
				_cooldown();
				return;
			}
			if (message.content.toLowerCase().startsWith("!tricksnmg")) {
				message.channel.send(mention + "Tricks for NMG-Players: \nhttps://youtube.com/watch?v=C_1nRHMYBHA");
				_cooldown();
				return;
			}
			if (message.content.toLowerCase().startsWith("!scrubs")) {
				message.channel.send(mention + "<https://wiki.ootrandomizer.com/index.php?title=Scrubs>");
				_cooldown();
				return;
			}
			if (message.content.toLowerCase().startsWith("!compress")) {
				message.channel.send(mention + "ZOOTDEC.z64 is not a randomized rom. It is short for **Z**elda **O**carina **o**f **T**ime **Dec**ompressed. \nYour randomized rom/seed looks like the following: \n```OoT_SettingsString_Seed```\nthat's 32 MB in size and ends with \n``-comp.z64``\nThe ROM options should always stay on ``Compressed [Stable]`` & never uncheck ``Create Spoiler Log``!");
				_cooldown();
				return;
			}
			if (message.content.toLowerCase().startsWith("!vc")) {
				message.channel.send(mention + "To install a randomizer seed on your wii: \n__Step 1__: Have a softmodded region lock free Wii \n__Step 2__: Have the randomizer itself and a USA 1.0 OoT Rom \n__Step 3__: Create compressed patched roms with the randomizer \n__Step 4__: Grab gzInjectGui AND the OoT 1.2 US Wad file in " +  message.guild.channels.find(channel => channel.name === "resources").toString() + " \n__Step 5__: Inject the compressed patched rom into a the OoT WAD file using gzInjectGui \n\n To prevent crashes during gameplay and possible problems with your console, please make sure to uninstall old wads using a Wad Manager of your choice. Please do **not** use the system menu to delete titles.");
				_cooldown();
				return;
			}
			if ((message.content.toLowerCase().startsWith("!readme")) || (message.content.toLowerCase().startsWith("!rtfm"))) {
				message.channel.send(mention + "Before asking for help, please go to <https://wiki.ootrandomizer.com/index.php?title=Readme> - read everything in there, then come back.");
				_cooldown();
				return;
			}
			if (message.content.toLowerCase().startsWith("!python")) {
				message.channel.send(mention + "Unlike the 3.0 version of the randomizer, newer dev builds do not include an installer. \nTo use these versions from Github, Python 3.6+ is needed: <https://www.python.org/downloads/> \nWhen installing Python, make sure you tick the boxes that say \n- ``Add to PATH`` \n- ``Install Tkinter and IDLE`` \n- ``Add to environment variables`` \n\nAfterwards, the randomizer can be started by double clicking the 'Gui.py' in Windows or using ``python3 Gui.py`` through the terminal of your UNIX/Mac OS. \nFor further information on how to set up the Randomizer on anything other than Windows, refer to <http://bit.ly/NotWindows>");
				_cooldown();
				return;
			}
			if (message.content.toLowerCase().startsWith("!pj64")) {
				message.channel.send(mention + "Project64 has certain known compatibility issues. We recommend using Bizhawk (<https://wiki.ootrandomizer.com/index.php?title=Bizhawk>) or Retroarch (<https://wiki.ootrandomizer.com/index.php?title=Retroarch>) instead! \nIf using these emulators is not an option, please refer to the following guide: \n<https://wiki.ootrandomizer.com/index.php?title=Project64>");
				_cooldown();
				return;
			}
			if (message.content.toLowerCase().startsWith("!vanilla")) {
				message.channel.send(mention + "If you wanna be cool, follow one simple rule:", {
					file: vanillaImage
				});
				_cooldown();
				return;
			}
			if (message.content.toLowerCase().startsWith("!routing")) {
				message.channel.send(mention + "This video guide by atz can help a lot with routing and reading the logic: https://www.youtube.com/watch?v=VpvZhm0Hx5Q");
				_cooldown();
				return;
			}
			if (message.content.toLowerCase().startsWith("!daddy")) {
				message.channel.send(mention + "YOU WANNA KNOW WHO MY DADDY IS? . .. ... well okay. Go bother <@82783364175630336>");
				_cooldown();
				return;
			}
			if (message.content.toLowerCase().startsWith("!hash")) {
				message.channel.send(mention + "The random set of characters (or in this case images) on the file select screen is a hash that's generated using the seed number. \nIt can be used to confirm everyone is on the same seed in a race setting without knowing the seed number itself.");
				_cooldown();
				return;
			}
			if (message.content.toLowerCase().startsWith("!bosses")) {
				message.channel.send(mention + "Dotzo made a video to cover the strats for every boss fight in the game: \nhttps://www.youtube.com/watch?v=u9Hs23Xwo-w");
				_cooldown();
				return;
			}
			if (message.content.toLowerCase().startsWith("!racing")) {
				message.channel.send(mention + "Here's a guide to help you setting up ahead of your first race: <https://wiki.ootrandomizer.com/index.php?title=Racing>");
				_cooldown();
				return;
			}
			if (message.content.toLowerCase().startsWith("!progressive")) {
				message.channel.send(mention + 'Certain types of items are "progressive", meaning that no matter what order the player encounters these items they will function as a series of upgrades. The following item types will be progressive chains: \n\n- Fairy Ocarina > Ocarina of Time \n- Hookshot > Longshot \n- Bomb Bag > Big Bomb Bag > Biggest Bomb Bag \n- Goron Bracelet > Silver Gauntlets > Gold Gauntlets \n- Slingshot > Big Bullet Bag > Biggest Bullet Bag \n- Bow > Big Quiver > Biggest Quiver \n- Silver Scale > Gold Scale \n- Adult Wallet > Giant´s Wallet > Tycoon´s Wallet (Shopsanity-Only) \n- Deku Stick Capacity Upgrades \n- Deku Nut Capacity Upgrades \n- Magic Meter to Double Magic');			
				_cooldown();
				return;
			}
			if (message.content.toLowerCase().startsWith("!fishing")) {
				message.channel.send(mention + "Uhm...", {
					file: fishingImage
				});
				_cooldown();
				return;
			}
			if (message.content.toLowerCase().startsWith("!multiworld")) {
				message.channel.send(mention + "Testrunner made a coop mod for the OoT Randomizer: Nothing is shared, however there are now player specific items which are mixed between all the worlds. \nSo if you obtain an item for yourself only you get it. If you obtain an item for another player then only they get it. This effectively means everyone will be playing different intermingled seeds. \nFor more information and instructions check <https://wiki.ootrandomizer.com/index.php?title=Multiworld>");
				_cooldown();
				return;
			}
			if (message.content.toLowerCase().startsWith("!winerror")) {
				message.channel.send(mention + "**If you are experiencing the WinError2 problem - make sure of the following:** \n- Extract all files from the 3.0 release zip (All of which are: OoTRandomizer.exe, Compress.exe & Decompress.exe) \n- Add the Randomizer folder to your antivirus exceptions/exclusions (Not sure how? google is your best friend) \n- Alternatively, you could add all 3 files individually to your antivirus exceptions/exclusions \n- The folder & programs possess read/write permissions \n- Don't have it in /Program Files \n- Be sure to ``Select Rom`` \n- Make sure your unzip your US 1.0 Base rom \n- Do **NOT** try to run the Randomizer from libraries or via a desktop shortcut. Run it from within it's folder!!");
				_cooldown();
				return;
			}
			if (message.content.toLowerCase().startsWith("!hints")) {
				message.channel.send(mention + "This can help you decypher cryptic hints from 3.0: <http://bit.ly/OoT-Rando-Hints-Updated>");
				_cooldown();
				return;
			}
			if (message.content.toLowerCase().startsWith("!4.0")) {
				message.channel.send(mention + "Soon™.");
				_cooldown();
				return;
			}

			//Suggestions
			if (message.content.toLowerCase().startsWith("!beans")) {
				message.channel.send(mention + "The randomization of beans would severely complicate the logic and lead to less fun. To compensate for poor use of beans, all 10 must be accessible before any of the locations checkable with beans could be placed into logic. \nBecause of randomizer logic having to assume that everyone plays as poorly as possible to prevent unwinnable situations (such as with key logic), it will expect you to plant them in places where they provide no benefit to the player before using them in helpful locations. If something is locked at a bean-accessible location, such as the Desert Colossus archway, you would be expected to find all 10 beans first to ensure you had a bean to plant there. \nDo you really want to have extra, useless beans to carry around and hog up useful check locations? Do you *really*?");
				_cooldown();
				return;
			}
			if (message.content.toLowerCase().startsWith("!mastersword")) {
				message.channel.send(mention + "Short answer: The pedestal is complicated. \n\nYou want a longer answer? Ok. When you get the Master Sword from the pedestal, you receive it temporarily. You only have it in your possession as long as you are an Adult, and when you revert to Child you return the item to the pedestal. Can you return your Boomerang to the pedestal, if you randomly pull it at the Master Sword location? How about a 5-pack of Bombchus? How about a Ruto's Letter? Can you put the Song of Storms away in the pedestal as you revert to Child? ...No? \nOk. That's why we aren't randomizing the Master Sword anytime soon.");
				_cooldown();
				return;
			}
			if (message.content.toLowerCase().startsWith("!models")) {
				message.channel.send(mention + "So far, OoTR can only customize Tunic colors, Navi colors and certain sound effects. This is related to the fact that OoT does not come with a standardized model format (like TWW for example), but handles everything related to this via display lists. Changing and generating these is rather difficult in comparison and new models will need to come with display lists generated from scratch. These must be cross platform compatible without giving an unfair advantage based on the platform used. Given all this custom models are currently not in the works.");
				_cooldown();
				return;
			}
			if (message.content.toLowerCase().startsWith("!letter")) {
				message.channel.send(mention + 'Zelda´s Letter cannot be randomized because it is a progressive item. The Weird Egg hatches into the Cucco, wakes Talon, and is then "upgraded" to Zelda´s Letter upon visiting Zelda in Hyrule Castle. Similar to how your Longshot will never be downgraded to a Hookshot if you happened to find them out of the intended order, Zelda´s Letter will not revert to an earlier state (except in rare situations to prevent softlocks) and will always come directly after the Cucco. \nIf you would like to change when this sequence of events can occur, there is an option in 3.0 to shuffle the Weird Egg. This cannot be altered to pick a starting point in the sequence like is available for the Adult Trade Quest, however, because items have more gameplay use than simply advancing themselves (such as using your Cucco to wake up Talon, which advances what is available at Lon Lon Ranch).');
				_cooldown();
				return;
            }
            if (message.content.toLowerCase().startsWith("!shufflemedallions")) {
                message.channel.send(mention + 'Shuffling the dungeon prizes with all other items would result in looking for a certain amount of random locations very similar to Triforce Hunt in A Link to the Past Randomizer. Therefore, an OoTR version of Triforce Hunt is more likely to be implemented instead. \nTriforce Hunt places pieces of the Triforce in random chests and your goal is to find a specific number of them.');
                _cooldown();
                return;
			}
            if (message.content.toLowerCase().startsWith("!glitchlogic")) {
                message.channel.send(mention + 'A setting between Glitchless and No Logic is in the works - follow the development in <#532621280357253150>.');
                _cooldown();
                return;
			}
            if (message.content.toLowerCase().startsWith("!entrancerando")) {
                message.channel.send(mention + 'You can find the link to our logic-less OoT Entrance Rando in <#438699704080007200> - it is called Beta Quest. An early proof-of-concept of integrating entrance rando with Item Randomizer has been accomplished, but further work is needed to fully incorporate logic and fix bugs.');
                _cooldown();
                return;
			}
            if (message.content.toLowerCase().startsWith("!crossover")) {
                message.channel.send(mention + 'There are a lot of barriers that exist before an OoT/MM crossover is even hypothetically possible. ...The most prominent being the absence of a working, logic-based MM randomizer to crossover with.');
                _cooldown();
                return;
			}
            if (message.content.toLowerCase().startsWith("!lowpriority")) {
                message.channel.send(mention + 'That is a really cool idea that people have suggested before; however, no one is actively working on that right now, as there are other features that the Devs and Contributors are focusing on instead. It might happen in the future, though, as that idea has been echoed by many users.');
                _cooldown();
                return;
			}
            if (message.content.toLowerCase().startsWith("!bait")) {
                message.channel.send(mention + "If you don't want WOTH hints to point you to things you don't need to complete the seed, change your settings to better match your playstyle. If you're participating in races with other community members, you're gonna have to make some compromises on settings - that's part of what comes with participating in races with other people.");
                _cooldown();
                return;
			}

			//Auto Reacts
			if ((/bad bot\W{0,}$/g.exec(message.content.toLowerCase()) !== null) || (/stupid bot\W{0,}$/g.exec(message.content.toLowerCase()) !== null) || (/shit bot\W{0,}$/g.exec(message.content.toLowerCase()) !== null)) {
				if (message.author.tag == "TreZc0_#7481") {
					message.reply("Daddy no :( Why you no love RandoBot anymore :(");
					return;
				} else {
					message.reply("SILENCE! HOW DARE YOU QUESTION MY AUTHORITY! REPORTED TO DADDY!");
					return;	
				}
			}

			if (/good bot\W{0,}$/g.exec(message.content.toLowerCase()) !== null) {
				if (message.author.tag == "TreZc0_#7481") {
					message.reply("Thank you daddy. I wouldn't have come this far without you. You're da best <3");
					return;
				} else {
					message.reply("I know right? I am freaking amazing! But you know who's even better? My daddy TreZc0_! :3");
					return;	
				}	
			}	
		}
	}
	if (botType == "master") {
		if (message.content.toLowerCase().includes("nimpize")) {
			if (!cooldown) { 
				message.reply("The OoTR mods and support team helped with nimpize setup and gameplay questions in the past, but since this server is focused on randomizers, we suggest that you check Ostrealava02's Youtube playlist if you are **stuck** in the game: https://www.youtube.com/playlist?list=PL-9xdNO5z5i-Kg8maZtF0IHx8KwMRlLGo \nIf you encounter a **bug** or a **setup issue**, you can send a direct message to Ostrealava02 via Discord (#Ostrealava#0709).");
				setTimeout(() => {
					cooldown = false;
				}, 90000);
				return;
			}
		}
		if (message.content.toLowerCase().includes("randomizer")) {
			if ((message.content.toLowerCase().includes("testrunner")) || (message.content.toLowerCase().includes("keysanity")) || (message.content.toLowerCase().includes("shopsanity")) || (message.content.toLowerCase().includes("gzInjectGui")) || (message.content.toLowerCase().includes("github.com")))
				return;
			if ((message.content.toLowerCase().includes("setup")) || (message.content.toLowerCase().includes("install")) || (message.content.toLowerCase().includes("installing"))) {
				if (!cooldown) { 
					message.reply("It looks like you need help with setting up the OoT Item Randomizer. This video will explain everything in detail: https://youtu.be/AhABHkWC5s0");
					cooldown = true;
					setTimeout(() => {
						cooldown = false;
					}, 90000);
				}
			}
		}
		if (message.content.toLowerCase().includes("winerror")) {
			if (!cooldown) { 
				message.reply("**If you are experiencing the WinError2 problem - make sure of the following:** \n- Extract all files from the 3.0 release zip (All of which are: OoTRandomizer.exe, compress.exe & decompress.exe) \n- Add the Randomizer folder to your antivirus exceptions/exclusions (Not sure how? google is your best friend) \n- Alternatively, you could add all 3 files individually to your antivirus exceptions/exclusions \n- The folder & programs possess read/write permissions \n- Don't have it in Program files \n- Be sure to ``Select Rom`` \n- Make sure your unzip your US 1.0 Base rom \n- Do **NOT** try to run the Randomizer from libraries or via a desktop shortcut. Run it from within it's folder!!");
				setTimeout(() => {
					cooldown = false;
				}, 90000);
			}
		}
	}
});

function _devVersionCheck(callback) {
	request('https://raw.githubusercontent.com/TestRunnerSRL/OoT-Randomizer/Dev/version.py', function (error, response, body) {
		if (error) {
			log.error('dev Version check error:', error);// Print the error if one occurred
			return; 
		}
		//console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
		let version = body.split("'")[1];
		_cooldown;
		callback(version);
	  });
}
function _cooldown() {
	duplicateCD = true;
	setTimeout(() => {
	duplicateCD = false;
	},3000);
};

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

bot.login(ootrBotToken);
