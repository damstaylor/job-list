import { useState } from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Box, OutlinedInput, InputLabel, MenuItem, FormControl, Chip } from '@mui/material'
import SelectOption from '../interfaces/SelectOption';

interface MultipleSelectChipProps {
  value: unknown[];
  options: SelectOption[];
  onChange: (e: SelectChangeEvent) => void;
  label: string;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name: string, personName: readonly string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const MultipleSelectChip: React.FC<MultipleSelectChipProps> = ({value, options, onChange, label}) => {
  const theme = useTheme();
  const [personName, setPersonName] = useState<string[]>([]);
  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-chip-label">{label}</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          multiple
          value={value}
          onChange={onChange}
          input={<OutlinedInput id="select-multiple-chip" label={label} />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value: string) => (
                <Chip
                  key={value}
                  label={options.find((option) => option.value === value)?.label}
                />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {options.map((option) => (
            <MenuItem
              key={option.value}
              value={option.value}
              style={getStyles(option.label, personName, theme)}
            >
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

export default MultipleSelectChip
