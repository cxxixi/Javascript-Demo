#  JavaScript Demos - Dedicated for Learning Database

This is a repo for database learners to learn concepts such as buffer replacement, ARIES logging and recovery protocols with interactive visualization demos. Ideally, these demos can help demonstrate these concepts in a graphical way with a clear step-by-step process. Just download, install and enjoy it ! 

## Prerequisites

1. Install npm and NodeJS

   npm is distributed with [Node.js](https://nodejs.org/)- which means that after you install Node.js, you automatically get npm installed. Download NodeJS installer from [here](<https://nodejs.org/en/). LTS version is recommended to download. 

   Check if your NodeJS and npm already set up

   ```
   $ node -v 
   $ npm -v
   ```

2. Install bower

   ```
   $ npm install -g bower
   ```


## Installation
1. Download the repository
2. Install npm modules: `npm install`
3. Install bower dependencies `bower install`
4. Start up the server: `node server.js`
5. View in browser at http://localhost:8080

## Current Demos (Updated April 23,2019)

- Basic Database Concepts
- Buffer Replacement Policies(Clock Policy Completed)
- ARIES Logging Protocol (Done)
- ARIES Recovery Protocol (Done)

## Tutorial 

In the following sections, we'll further explain how you use these demos to facilicate your learning. We will go through some examples indicating how these demos work. 







#### ARIES PROTOCOL

This demo shows how you create a write-ahead-log (WAL) according to your requests based on ARIES logging protocol.  You should select exactly the information each kind of txn requires to add in a valid record to the write-ahead-log. **Any invalid request will be ignored**. 

The rules you should follow are as follows:

- **`WRITE`** txn requires txn number, the page id it writes to,  old value before write and new value after write.
- **`COMMIT`** txn requires only txn number. Any other additional information will make your txn request fail.
- **`CHECKPOINT`** txn requires nothing since we don't need other information to take a checkpoint. Similarly, additional information will only make your request invalid. 
- **`ABORT`** txn needs txn number only.
- **`END`** txn needs txn number only.



#### RECOVERY

In this part, we continue with ARIES protocol and you will learn how we recover the database before crash occurs based on the write-ahead-log you create in the logging part. Basically, we need to finish three phases: **`Analysis`**, **`Redo`** and **`Undo`** to recover the database.



**ANALYSIS PHASE**

In this phase, we will read all the records in the WAL to identify dirty pages in the buffer pool
and active txns at the time of the crash.

To start analysis phase, you should click the button**`ANALYSIS`** first. It will activate empty **Dirty Page Table** **(DPT)** and **Active Transaction Table** **(ATT)**.  By clicking the checkbox for each record, you can see the changes in DPT and ATT. 



**REDO PHASE**

During Redo phase, we will repeat all actions starting from an appropriate point in the log. After analysis phase, you've generated DPT and ATT based on which we conduct redo operations. 

- Any committed txns will be redone during this phase. `TXN-END` will be added to the log after the committed is redone. Click the txn with status "**C**" (committed) in the ATT, you will be able to redo the txn.
- Txns not committed will be left to the UNDO phase when these txns will be undo. There is no operations regarding these txns during REDO phase. Click the txn with status"**U**", an error message will pop up.



**UNDO PHASE**

In Undo phase, uncommitted txns before database crash will be undone. It will undo the txn in reverse order, i.e, starting from the bottom of the WAL. Using the `prev_LSN`, we will be able to keep track of the next undo operation. By clicking the checkbox for these txns in the ATT, we will undo the txns and add corresponding records to the log.

