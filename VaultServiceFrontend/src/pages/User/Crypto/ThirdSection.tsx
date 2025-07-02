import { Box, Card, CardContent, Grid, ButtonGroup, Button, Select, MenuItem, useTheme, Typography } from "@mui/material";
import { useEffect, useRef, useState } from 'react';

function TradingViewWidget({ coin, filter }: TradingViewWidgetProps) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scriptContent = `
      {
        "autosize": true,
        "symbol": "${coin}",
        "interval": "D",
        "timezone": "Etc/UTC",
        "theme": "light",
        "style": "2",
        "locale": "en",
        "range": "${filter}",
        "hide_top_toolbar": true,
        "allow_symbol_change": true,
        "save_image": false,
        "calendar": false,
        "hide_volume": true,
        "support_host": "https://www.tradingview.com"
      }
    `;

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = scriptContent;
    

    if (container.current) {
  while (container.current.firstChild) {
    container.current.removeChild(container.current.firstChild);
  }
  container.current.appendChild(script);
}

  }, [coin, filter]);

  return (
    <Box className="tradingview-widget-container" ref={container}>
      <Box className="tradingview-widget-container__widget" />
      <Box className="tradingview-widget-copyright">
        <a
          href="https://www.tradingview.com/"
          rel="noopener nofollow"
          target="_blank"
        >
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </Box>
    </Box>
  );
}

interface TradingViewWidgetProps {
  coin: string;
  filter: string;
}

type CoinSymbol = keyof typeof coinNames;

const coinsUSD: CoinSymbol[] = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT" , "DOGEUSDT", "XRPUSDT", "ADAUSDT"];
const coinNames = {
  BTCUSDT: "Bitcoin",
  ETHUSDT: "Ethereum",
  BNBUSDT: "Binance Coin",
  SOLUSDT: "Solana",
  DOGEUSDT: "Dogecoin",  
  XRPUSDT : "XRP",
  ADAUSDT: "Cardano",
};

const filterButtons = [
  { label: "DAY", value: "1D" },
  { label: "WEEK", value: "1W" },
  { label: "MONTH", value: "1M" },
  { label: "YEAR", value: "12M" },
];

const walletData = [
  { symbol: "BCH", date: "February 11th 2025, 11:11:27 AM" },
  { symbol: "SOL", date: "February 11th 2025, 11:11:27 AM" },
  { symbol: "BNB", date: "February 11th 2025, 11:11:27 AM" },
  { symbol: "ADA", date: "February 11th 2025, 11:11:27 AM" },
  { symbol: "DOGE", date: "February 11th 2025, 11:11:27 AM" },
  { symbol: "BTC", date: "February 11th 2025, 11:11:27 AM" },
];


const ThirdSection = () => {
    const theme = useTheme();
  const [selectedFilter, setSelectedFilter] = useState("1D");
  const [symbol, setSymbol] = useState("BTCUSDT");

  const handleSymbolChange = (event:any) => {
    setSymbol(event.target.value);
  };

  return (
    <Box className="third-section">
      <Box className="tleft-box">
        <Card className="left-card">
          <CardContent sx={{ backgroundColor: theme.palette.background.default }}>
            <Grid container  >
              <Grid container spacing={2} className="analytics-header">
                <span className="section-title">Analytics</span>
                    <Select
                    value={symbol}
                    onChange={handleSymbolChange}
                    className="symbol-select"
                  >
                    {coinsUSD.map((item, index) => (
                      <MenuItem key={index} value={item}>
                        <Grid container  alignItems="center">
                          <Grid item>
                            <img
                              className="coin-icon"
                             src={`https://assets.coincap.io/assets/icons/${item.toLowerCase().replace(/usdt$/i, '')}@2x.png`}
                              alt="coin"
                            />
                          </Grid>
                          <Grid item>
                            <span>{coinNames[item]}</span>
                          </Grid>
                        </Grid>
                      </MenuItem>
                    ))}
                  </Select>
              </Grid>
              <Grid >
                <Box className="controls"  >
                  <ButtonGroup className="button-group">
                    {filterButtons.map((filter) => (
                      <Button  sx={{ color: theme.palette.text.gray }}
                        key={filter.value}
                        className={selectedFilter === filter.value ? "btn-selected" : "btn-default"}
                        onClick={() => setSelectedFilter(filter.value)}
                      >
                        {filter.label}
                      </Button>
                    ))}
                  </ButtonGroup>
                </Box>
              </Grid>
            </Grid>
            <Box className="chart-box">
              <TradingViewWidget coin={symbol} filter={selectedFilter} />
            </Box>
          </CardContent>
        </Card>
      </Box>

     <Box className="tright-box" sx={{ backgroundColor: theme.palette.background.default }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
                Crypto Wallets
            </Typography>
            {walletData.map((wallet, index) => (
                <Box key={index} className="wallet-item">
                <Box className="wallet-left">
                    <img
                    src={`https://assets.coincap.io/assets/icons/${wallet.symbol.toLowerCase()}@2x.png`}
                    alt={wallet.symbol}
                    className="wallet-icon"
                    />
                    <Box ml={1}>
                    <Typography className="wallet-name">{wallet.symbol}</Typography>
                    <Typography className="wallet-status">completed</Typography>
                    </Box>
                </Box>
                <Box className="wallet-right">
                    <Typography className="wallet-balance">0.00000000</Typography>
                    <Typography className="wallet-date" sx={{ color: theme.palette.text.gray }}>
                    {wallet.date}
                    </Typography>
                </Box>
                </Box>
            ))}
            </Box>  
    </Box>
  );
};


export default ThirdSection;
