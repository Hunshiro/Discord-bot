
const { Client,IntentsBitField,EmbedBuilder, userMention } = require('discord.js');
const arrayGif = require('./utils/gifLinks');
const fs = require("fs");
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]});

  
      
      

    require("dotenv").config();
    client.on("ready", async(c) =>{
        console.log(`✅ ${c.user.tag} is ready to go online`)
        client.user.setActivity({
            name: `Exploring cave with your mom🥵`,
        });
       
    });
  
    const prefix= 'rc';
    client.on('messageCreate',(message)=>{
        // Ignore messages from bots and messages that don't start with the prefix
    if (message.author.bot || !message.content.startsWith(prefix)) return;

    // Split the message content into command and arguments
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'help') {
      // Create a new embed
      const embed = new EmbedBuilder()
          .setColor('#FFD700')
          .setTitle('Fun Commands Help')
          .setDescription('Here are some fun commands:')
          .addFields(
            { name: 'punch', value: 'Punch someone!', inline: true },
            { name: 'kiss', value: 'Give someone a kiss!', inline: true },
            { name: 'cuddle', value: 'Cuddle with someone!', inline: true },
            { name: 'hug', value: 'Give someone a warm hug!', inline: true },
            { name: 'sex', value: 'Nsfw fun command😳', inline: true },
            { name: 'kill', value: 'Kill someone!', inline: true },
            { name: 'blush', value: 'Blush with shyness!', inline: true },
            { name: 'bite', value: 'Playfully bite someone!', inline: true },
            { name: 'nom', value: 'Nom nom nom!', inline: true },
            { name: 'wave', value: 'Wave to someone!', inline: true },
            { name: 'kick', value: 'Kick someone!', inline: true },
            { name: 'cry', value: 'Cry out loud!', inline: true },
            { name: 'pat', value: 'Give someone a pat!', inline: true },
            { name: 'slap', value: 'Slap someone!', inline: true },
            { name: 'spank', value: 'Spank someone!', inline: true },
            { name: 'flirt', value: 'Flirt with someone!', inline: true },
            { name: 'mad', value: 'Show your anger!', inline: true }
        )
          .setFooter({text: 'Use prefix = Rc before running any command'});

      // Send the embed to the channel
      message.channel.send({embeds : [embed]});
  }
        
        if(command === "punch"){
            const memberMention = message.mentions.members.first();
            const punchGifs = arrayGif.punch;
            if (!memberMention) {
                return message.reply('You need to mention a user to punch!');
              }
            const userMention = memberMention.user;
            const randomIndex = Math.floor(Math.random() * punchGifs.length);
             const punchUrl = punchGifs[randomIndex];

            const embed = new EmbedBuilder()
            .setColor(0x0099FF)
           
            .setDescription(`${message.author} gives a nice warming punch to ${userMention}`)
            .setImage(punchUrl)
            .setTimestamp()
            
            message.channel.send({embeds : [embed]})
        }

        if(command === "cuddle"){
            const memberMention = message.mentions.members.first();
            if (!memberMention) {
                return message.reply('You need to mention a user to cuddle!');
              }
            const userMention = memberMention.user;
            const cuddleGifs = arrayGif.cuddle;
            const randomIndex = Math.floor(Math.random() * cuddleGifs.length);
             const cuddleUrl = cuddleGifs[randomIndex];

            const embed = new EmbedBuilder()
            .setColor(0x0099FF)
           
            .setDescription(`${message.author} wants to cuddle ${userMention} ❤️` )
            .setImage(cuddleUrl)
            .setTimestamp()
            
            message.channel.send({embeds : [embed]})
        }

        if(command=== "kiss"){
            const memberMention = message.mentions.members.first();
            if (!memberMention) {
                return message.reply('You need to mention a user to kiss!');
              }
            const userMention = memberMention.user;
                        const kissGifs = arrayGif.kiss;
            const randomIndex = Math.floor(Math.random() * kissGifs.length);
             const kissUrl = kissGifs[randomIndex];

            const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setDescription(`${message.author} gives warm kiss to ${userMention} 🤭`)
            .setImage(kissUrl)
            .setTimestamp()
            
            message.channel.send({embeds : [embed]})
        }

        if(command=== "hug"){
            const memberMention = message.mentions.members.first();
            if (!memberMention) {
                return message.reply('You need to mention a user to punch!');
              }
            const userMention = memberMention.user;

            const hugGifs = arrayGif.hug;
            const randomIndex = Math.floor(Math.random() * hugGifs.length);
             const hugUrl = hugGifs[randomIndex];

            const embed = new EmbedBuilder()
            .setColor(0x0099FF)
           
            .setDescription(`${message.author} wanna give warm hug to ${userMention} ❤️` )
            .setImage(hugUrl)
            .setTimestamp()
            
            message.channel.send({embeds : [embed]})
        }

        if(command === "sex"){
            const memberMention = message.mentions.members.first();
            if (!memberMention) {
                return message.reply('You need to mention a user to punch!');
              }
            const userMention = memberMention.user;
                        const sexGifs = arrayGif.sex;
            const randomIndex = Math.floor(Math.random() * sexGifs.length);
             const sexUrl = sexGifs[randomIndex];

            const embed = new EmbedBuilder()
            .setColor(0x0099FF)
           
            .setDescription(`${message.author} wanna fuck  ${userMention} badly🥵` )
            .setImage(sexUrl)
            .setTimestamp()
            
            message.channel.send({embeds : [embed]})
        }

        if(command === "kill"){
            const memberMention = message.mentions.members.first();
            if (!memberMention) {
                return message.reply('You need to mention a user to kill!');
              }
            const userMention = memberMention.user;
                        const killGifs = arrayGif.kill;
            const randomIndex = Math.floor(Math.random() * killGifs.length);
             const killUrl = killGifs[randomIndex];

            const embed = new EmbedBuilder()
            .setColor(0x0099FF)
           
            .setDescription(`Oooohhh nooo!!${message.author} killed ${userMention} 🥲` )
            .setImage(killUrl)
            .setTimestamp()
            
            message.channel.send({embeds : [embed]})
        }
       
        if(command=== "blush"){
         
                      const blushGifs = arrayGif.blush;
          const randomIndex = Math.floor(Math.random() * blushGifs.length);
           const blushUrl = blushGifs[randomIndex];

          const embed = new EmbedBuilder()
          .setColor(0x0099FF)
         
          .setDescription(`Aww there there!!${message.author} is blushing so hard rn🤭` )
          .setImage(blushUrl)
          .setTimestamp()
          
          message.channel.send({embeds : [embed]})
      }

      if(command === "nom"){
        const memberMention = message.mentions.members.first();
                    const nomGifs = arrayGif.nom;
        if (!memberMention) {
            return message.reply('You need to mention a user to punch!');
          }
        const userMention = memberMention.user;
        const randomIndex = Math.floor(Math.random() * nomGifs.length);
         const nomUrl = nomGifs[randomIndex];

        const embed = new EmbedBuilder()
        .setColor(0x0099FF)
       
        .setDescription(`${message.author} wants to eat ${userMention} out 😶‍🌫️` )
        .setImage(nomUrl)
        .setTimestamp()
        
        message.channel.send({embeds : [embed]})
    }
           
    if(command === "bite"){
      const memberMention = message.mentions.members.first();
                  const biteGifs = arrayGif.bite;
      if (!memberMention) {
          return message.reply('You need to mention a user to bite!');
        }
      const userMention = memberMention.user;
      const randomIndex = Math.floor(Math.random() * biteGifs.length);
       const biteUrl = biteGifs[randomIndex];

      const embed = new EmbedBuilder()
      .setColor(0x0099FF)
     
      .setDescription(`Ohhh nooooo....!!${message.author} wanna bite ${userMention} 🥵` )
      .setImage(biteUrl)
      .setTimestamp()
      
      message.channel.send({embeds : [embed]})
  }
  if(command === "wave"){
    const memberMention = message.mentions.members.first();
                const waveGifs = arrayGif.wave;
    if (!memberMention) {
        return message.reply('You need to mention a user to wave!');
      }
    const userMention = memberMention.user;
    const randomIndex = Math.floor(Math.random() * waveGifs.length);
     const waveUrl = waveGifs[randomIndex];

    const embed = new EmbedBuilder()
    .setColor(0x0099FF)
   
    .setDescription(`hi there!!${message.author} waves ${userMention} 😌` )
    .setImage(waveUrl)
    .setTimestamp()
    
    message.channel.send({embeds : [embed]})
}

if(command === "kick"){
  const memberMention = message.mentions.members.first();
              const kickGifs = arrayGif.kick;
  if (!memberMention) {
      return message.reply('You need to mention a user to kick!');
    }
  const userMention = memberMention.user;
  const randomIndex = Math.floor(Math.random() * kickGifs.length);
   const kickUrl = kickGifs[randomIndex];

  const embed = new EmbedBuilder()
  .setColor(0x0099FF)
 
  .setDescription(`${message.author} gives nice kick to ${userMention} 😡` )
  .setImage(kickUrl)
  .setTimestamp()
  
  message.channel.send({embeds : [embed]})
}
if(command === "cry"){
 
              const cryGifs = arrayGif.cry;
  const randomIndex = Math.floor(Math.random() * cryGifs.length);
   const cryUrl = cryGifs[randomIndex];

  const embed = new EmbedBuilder()
  .setColor(0x0099FF)
 
  .setDescription(`there there...!!!${message.author} stop crying😨` )
  .setImage(cryUrl)
  .setTimestamp()
  
  message.channel.send({embeds : [embed]})
}
if(command === "pat"){
  const memberMention = message.mentions.members.first();
              const patGifs = arrayGif.pat;
  if (!memberMention) {
      return message.reply('You need to mention a user to pat!');
    }
  const userMention = memberMention.user;
  const randomIndex = Math.floor(Math.random() * patGifs.length);
   const patUrl = patGifs[randomIndex];

  const embed = new EmbedBuilder()
  .setColor(0x0099FF)
 
  .setDescription(`${message.author} pats ${userMention} 😌` )
  .setImage(patUrl)
  .setTimestamp()
  
  message.channel.send({embeds : [embed]})
}
          
if(command === "slap"){
  const memberMention = message.mentions.members.first();
              const slapGifs = arrayGif.slap;
  if (!memberMention) {
      return message.reply('You need to mention a user to pat!');
    }
  const userMention = memberMention.user;
  const randomIndex = Math.floor(Math.random() * slapGifs.length);
   const slapUrl = slapGifs[randomIndex];

  const embed = new EmbedBuilder()
  .setColor(0x0099FF)
 
  .setDescription(`${message.author} slapped ${userMention} 😌` )
  .setImage(slapUrl)
  .setTimestamp()
  
  message.channel.send({embeds : [embed]})
}

if(command === "spank"){
  const memberMention = message.mentions.members.first();
              const spankGifs = arrayGif.spank;
  if (!memberMention) {
      return message.reply('You need to mention a user to spank!');
    }
  const userMention = memberMention.user;
  const randomIndex = Math.floor(Math.random() * spankGifs.length);
   const spankUrl = spankGifs[randomIndex];

  const embed = new EmbedBuilder()
  .setColor(0x0099FF)
 
  .setDescription(`Daddy ${message.author} spanks ${userMention} 🤤` )
  .setImage(spankUrl)
  .setTimestamp()
  
  message.channel.send({embeds : [embed]})
}

if(command === "flirt"){
  const memberMention = message.mentions.members.first();
              const flirtGifs = arrayGif.flirt;
              const flirtlines = arrayGif.flirtlines;
  if (!memberMention) {
      return message.reply('You need to mention a user to spank!');
    }
  const userMention = memberMention.user;
  const randomIndex = Math.floor(Math.random() * flirtGifs.length);
  const index = Math.floor(Math.random() * flirtlines.length);
   const flirtUrl = flirtGifs[randomIndex];
   const flirty = flirtlines[index];

  const embed = new EmbedBuilder()
  .setColor(0x0099FF)
 
  .setDescription(flirty+` ${userMention} ❤️` )
  .setImage(flirtUrl)
  .setTimestamp()
  
  message.channel.send({embeds : [embed]})
}

if(command === "mad" ||  command === "angry" ){
  const memberMention = message.mentions.members.first();
              const madGifs = arrayGif.mad;
  if (!memberMention) {
    const randomIndex = Math.floor(Math.random() * madGifs.length);
  
    const madUrl = madGifs[randomIndex];
    
 
   const embed = new EmbedBuilder()
   .setColor(0x0099FF)
  
   .setDescription(`Ohh no.. looks like${message.author} is mad upon someone😭` )
   .setImage(madUrl)
   .setTimestamp()
   
   message.channel.send({embeds : [embed]})
    }
    else{
  const userMention = memberMention.user;
  const randomIndex = Math.floor(Math.random() * madGifs.length);
  
   const madUrl = madGifs[randomIndex];
   

  const embed = new EmbedBuilder()
  .setColor(0x0099FF)
 
  .setDescription(`Ohh no.. ${message.author} mad on ${userMention} 😔` )
  .setImage(madUrl)
  .setTimestamp()
  
  message.channel.send({embeds : [embed]})
}}
           
       

      
    })

   

// Replace 'YOUR_BOT_TOKEN' with your actual bot token
client.login(process.env.TOKEN_NEW);
