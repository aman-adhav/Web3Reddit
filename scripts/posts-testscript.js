const main = async () => {
    const postsContractFactory = await hre.ethers.getContractFactory('Posts');
    const postsContract = await postsContractFactory.deploy({
        value: hre.ethers.utils.parseEther('0.1'),
      });
    await postsContract.deployed();
    console.log('Contract addy:', postsContract.address);
  
    /*
     * Get Contract balance
     */
    let contractBalance = await hre.ethers.provider.getBalance(
        postsContract.address
    );
    console.log(
      'Contract balance:',
      hre.ethers.utils.formatEther(contractBalance)
    );
  
  
  
    /*
     * Get Contract balance to see what happened!
     */
    contractBalance = await hre.ethers.provider.getBalance(postsContract.address);
    console.log(
      'Contract balance:',
      hre.ethers.utils.formatEther(contractBalance)
    );

    async function postTraverse(subPosts){ 
        for (let i = 0; i < subPosts.length; i++){
            const post = await postsContract.getPost(subPosts[i]);
    
            console.log(post);
    
            if (post["subPosts"].length > 0){
              postTraverse(post["subPosts"]);
            }
        }
    }

    let randomf = await postsContract.f(1);
    await randomf.wait();
    
    let randomf1 = await postsContract.f(1, true);
    await randomf1.wait();

    
    // let createPost = await postsContract.addPost('First Post');
    // await createPost.wait();

    // let createSecondPost = await postsContract.addPost('Second Post');
    // await createSecondPost.wait();

    // let createThirdPost = await postsContract.addPost('third Post', 2);
    // await createThirdPost.wait();

    // let createFourthPost = await postsContract.addPost('fourth Post', 1);
    // await createFourthPost.wait();

    // const rootPostIds = await postsContract.getRootPostIds();
    // console.log(rootPostIds);

    // try {
    //     await postTraverse(rootPostIds);
    //     process.exit(0);
    //   } catch (error) {
    //     console.log(error);
    //     process.exit(1);
    //   }


  };

  const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
  
  runMain();