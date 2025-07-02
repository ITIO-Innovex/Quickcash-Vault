import {
    Box,
    Typography,
    Grid,
    Paper,
} from '@mui/material';
import {
    CircularProgressbarWithChildren,
    buildStyles,
} from 'react-circular-progressbar';
import { ArrowDownward, ArrowUpward, Person } from '@mui/icons-material';
import { DollarSign } from 'lucide-react';
import PageHeader from '@/components/common/pageHeader';


const stats = [
    {
        label: 'Credit',
        value: 3228.13,
        percent: 75,
        color: '#2dd4bf',
        icon: <ArrowUpward sx={{ fontSize: 32, color: '#2dd4bf' }} />,
    },
    {
        label: 'Debit',
        value: 1620.12,
        percent: 25,
        color: '#f97316',
        icon: <ArrowDownward sx={{ fontSize: 32, color: '#f97316' }} />,
    },
    {
        label: 'Investing',
        value: 121.55,
        percent: 10,
        color: '#8b5cf6',
        icon: <DollarSign size={32} color="#8b5cf6" />,
    },
    {
        label: 'Earning',
        value: 182886.49,
        percent: 95,
        color: '#4d7c0f',
        icon: <DollarSign size={32} color="#4d7c0f" />,
    },
];


export default function DashboardStats() {
    return (
        <Box className='innerWrapper' sx={{ '& > :not(style)': { mb: 3 } }}>
            <Box className='greeting-text'>
                <Typography
                    variant="body1"
                    sx={{ fontWeight: 'bold', color: 'text.primary', mb: { xs: 1, sm: 0 } }}
                >
                    Good morning, Jean-Pierre!
                </Typography>
                <Typography
                    variant="body2"
                    sx={{ display: 'flex', alignItems: 'center' }}
                >
                    <Person sx={{ width: 16, height: 16, mr: 0.5 }} />
                    You were last logged in on 5 February 2025.
                </Typography>
            </Box>
            <Box sx={{ p: { xs: 2, md: 4 } }}>
                <Grid container spacing={{ xs: 2, sm: 4 }}>
                    {stats.map((stat) => (
                        <Grid key={stat.label} item xs={12} sm={6} md={6} lg={3}>
                            <Paper className='top-charts'
                                elevation={3}>
                                <Box className='chart-start'>
                                    <CircularProgressbarWithChildren
                                        value={stat.percent}
                                        strokeWidth={10}
                                        styles={buildStyles({
                                            pathColor: stat.color,
                                            trailColor: '#e5e7eb',
                                        })}
                                    >
                                        <Box display="flex" flexDirection="column" alignItems="center" mt={1}>
                                            {stat.icon}
                                            <Typography variant="subtitle2" fontWeight="bold" mt={1}>
                                                {stat.label}
                                            </Typography>
                                            <Typography variant="body2" fontWeight="bold">
                                                ${stat.value.toLocaleString()}
                                            </Typography>
                                        </Box>
                                    </CircularProgressbarWithChildren>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
}
