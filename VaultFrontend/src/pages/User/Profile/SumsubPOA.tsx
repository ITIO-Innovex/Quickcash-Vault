import SumSubWebSdk from '@sumsub/websdk-react';

const SumsubPOA = ({ token }) => {
  if (!token) return null;

  return (
    <SumSubWebSdk
      accessToken={token}
      expirationHandler={async () => {
        console.log('SDK token expired.');
        return '';
      }}
      onMessage={(type, payload) => {
        console.log('Sumsub SDK Event:', type, payload);
      }}
      config={{}}
      options={{}}
      style={{ width: '100%', height: '600px' }}
    />
  );
};
export default SumsubPOA;
