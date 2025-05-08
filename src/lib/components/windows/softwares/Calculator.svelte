<script lang="ts">
  import { onMount } from 'svelte';
  import { t } from '$lib/i18n/i18n';
  
  let displayValue = '0';
  let previousValue: string | null = null;
  let operator: string | null = null;
  let waitingForOperand = false;
  
  // Numbers and operations
  const numbers = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '.'];
  const operations = [
    { symbol: '÷', value: '/' },
    { symbol: '×', value: '*' },
    { symbol: '-', value: '-' },
    { symbol: '+', value: '+' },
    { symbol: '=', value: '=' }
  ];
  
  // Additional operations
  const additionalOperations = [
    { symbol: 'C', value: 'clear' },
    { symbol: '±', value: 'negate' },
    { symbol: '%', value: 'percent' },
    { symbol: '⌫', value: 'backspace' }
  ];
  
  function clearDisplay() {
    displayValue = '0';
    previousValue = null;
    operator = null;
    waitingForOperand = false;
  }
  
  function inputDigit(digit: string) {
    if (waitingForOperand) {
      displayValue = digit;
      waitingForOperand = false;
    } else {
      displayValue = displayValue === '0' ? digit : displayValue + digit;
    }
  }
  
  function inputDecimal() {
    if (waitingForOperand) {
      displayValue = '0.';
      waitingForOperand = false;
    } else if (displayValue.indexOf('.') === -1) {
      displayValue = displayValue + '.';
    }
  }
  
  function handleOperation(nextOperator: string) {
    const inputValue = parseFloat(displayValue);
    
    if (previousValue === null) {
      previousValue = displayValue;
    } else if (operator) {
      const currentValue = parseFloat(previousValue);
      let newValue;
      
      switch (operator) {
        case '+':
          newValue = currentValue + inputValue;
          break;
        case '-':
          newValue = currentValue - inputValue;
          break;
        case '*':
          newValue = currentValue * inputValue;
          break;
        case '/':
          newValue = inputValue !== 0 ? currentValue / inputValue : 'Error';
          break;
        default:
          newValue = inputValue;
      }
      
      displayValue = String(newValue);
      previousValue = displayValue;
    }
    
    waitingForOperand = true;
    operator = nextOperator === '=' ? null : nextOperator;
  }
  
  function handleAdditionalOperation(operation: string) {
    switch (operation) {
      case 'clear':
        clearDisplay();
        break;
      case 'negate':
        displayValue = String(-parseFloat(displayValue));
        break;
      case 'percent':
        displayValue = String(parseFloat(displayValue) / 100);
        break;
      case 'backspace':
        displayValue = displayValue.length > 1 ? displayValue.slice(0, -1) : '0';
        break;
    }
  }
  
  function handleButtonClick(value: string) {
    if (value === '.') {
      inputDecimal();
    } else if (!isNaN(parseInt(value))) {
      inputDigit(value);
    } else if (['+', '-', '*', '/', '='].includes(value)) {
      handleOperation(value);
    } else {
      handleAdditionalOperation(value);
    }
  }
  
  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      // Handles the action when Enter is pressed
      handleOperation('=');
    } else if (!isNaN(parseInt(e.key)) || e.key === '.') {
      // Handles numbers and decimal point
      handleButtonClick(e.key);
    } else if (['+', '-', '*', '/'].includes(e.key)) {
      // Handles basic operators
      handleOperation(e.key);
    } else if (e.key === 'Escape') {
      // Escape clears the calculator
      clearDisplay();
    } else if (e.key === 'Backspace') {
      // Backspace deletes the last digit
      handleAdditionalOperation('backspace');
    }
  }
  
  onMount(() => {
    window.addEventListener('keydown', handleKeydown);
    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  });
</script>

<div class="calculator">
  <div class="calculator-display">
    <div class="calculator-display-value">{displayValue}</div>
  </div>
  
  <div class="calculator-keypad">
    <div class="calculator-additional-operations">
      {#each additionalOperations as op}
        <button 
          class="calculator-key operation-key additional-key"
          on:click={() => handleAdditionalOperation(op.value)}
          on:keydown={(e) => e.key === 'Enter' && handleAdditionalOperation(op.value)}
          tabindex="0"
          aria-label={op.symbol}
        >
          {op.symbol}
        </button>
      {/each}
    </div>
    
    <div class="calculator-main-keys">
      <div class="calculator-digits">
        {#each numbers as number}
          <button 
            class="calculator-key digit-key"
            class:zero={number === '0'}
            on:click={() => handleButtonClick(number)}
            on:keydown={(e) => e.key === 'Enter' && handleButtonClick(number)}
            tabindex="0"
            aria-label={number}
          >
            {number}
          </button>
        {/each}
      </div>
      
      <div class="calculator-operations">
        {#each operations as op}
          <button 
            class="calculator-key operation-key"
            class:equals={op.value === '='}
            on:click={() => handleOperation(op.value)}
            on:keydown={(e) => e.key === 'Enter' && handleOperation(op.value)}
            tabindex="0"
            aria-label={op.symbol}
          >
            {op.symbol}
          </button>
        {/each}
      </div>
    </div>
  </div>
</div>

<style>
  .calculator {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: var(--window-bg, #fff);
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    font-family: 'Segoe UI', sans-serif;
  }
  
  .calculator-display {
    background-color: var(--window-header, #f0f0f0);
    padding: 20px;
    margin-bottom: 15px;
    border-radius: 5px;
    text-align: right;
    min-height: 60px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  
  .calculator-display-value {
    font-size: 32px;
    font-weight: 500;
    color: var(--text-primary, #000);
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .calculator-keypad {
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 10px;
  }
  
  .calculator-additional-operations {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    margin-bottom: 10px;
  }
  
  .calculator-main-keys {
    display: flex;
    flex: 1;
    gap: 10px;
  }
  
  .calculator-digits {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 10px;
    flex: 3;
  }
  
  .calculator-operations {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 10px;
    flex: 1;
  }
  
  .calculator-key {
    font-size: 20px;
    padding: 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    background-color: var(--window-bg, #fff);
    color: var(--text-primary, #000);
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .calculator-key:hover {
    background-color: var(--win-accent, #0078d7);
    color: white;
  }
  
  .operation-key {
    background-color: var(--window-header, #f0f0f0);
  }
  
  .digit-key.zero {
    grid-column: span 3;
  }
  
  .operation-key.equals {
    background-color: var(--win-accent, #0078d7);
    color: white;
  }
  
  .additional-key {
    background-color: var(--taskbar-hover, #e5e5e5);
  }
  
  @media (max-width: 500px) {
    .calculator-key {
      font-size: 16px;
      padding: 10px;
    }
    
    .calculator-display-value {
      font-size: 24px;
    }
  }
</style> 