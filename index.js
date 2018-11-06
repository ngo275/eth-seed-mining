const KEY = 'REYECHF1JV75C91JZQFV66RGY2S1QIK6UE';

const bip39 = require('bip39');
const hdkey = require('ethereumjs-wallet/hdkey');
const api = require('etherscan-api').init(KEY);
const wordlist = require('./wordlist');


const getEthereumWalletFromMnemonic = async (mnemonic) => {
  const seed = bip39.mnemonicToSeed(mnemonic)
  const root = hdkey.fromMasterSeed(seed)
  const path = 'm/44\'/60\'/0\'/0/0'
  const ethKey = root.derivePath(path)
  return ethKey.getWallet()
}

const getEthereumAddressFromMnemonic = async (mnemonic) => {
  const wallet = await getEthereumWalletFromMnemonic(mnemonic)
	return wallet.getAddressString()
}

const isValidMnemonic = async (mnemonic) => {
  let isValid = true
  try {
    isValid = await bip39.validateMnemonic(mnemonic)
  } catch (e) {
    isValid = false
  }
  return isValid
}

console.log('start');

(setInterval(async function() {
  // const m = wordlist.words();
  const m = await bip39.generateMnemonic();
  const isValid = await isValidMnemonic(m);

  if (!isValid) {
    return;
  }

  const address = await getEthereumAddressFromMnemonic(m);

  console.log(m, address);
  const res = await api.account.balance(address);
  if (res.status === '1') {
    const balance = res.result;
    console.log(balance);
    if (balance !== '0') {
      process.exit(1);
    }
  } else {
    console.log('failed');
  }
}, 400));


