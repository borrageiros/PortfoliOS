<script lang="ts">
  import { onMount, afterUpdate } from 'svelte';
  import { t, locale } from '$lib/i18n/i18n';
  import { tick } from 'svelte';
  import { loadData } from '$lib/helpers';

  // State to store loaded data
  let information: any = null;
  let projects: any = null;
  let about: any = null;
  let languages: any = null;
  let skills: any = null;
  let informatic: any = null;
  let certifications: any = null;
  let contact: any = null;
  let reviews: any = null;
  let complementary: any = null;

  // Function to load all data
  async function loadAllData() {
    information = await loadData('information');
    about = await loadData('about');
    projects = await loadData('projects');
    languages = await loadData('languages');
    skills = await loadData('skills');
    informatic = await loadData('informatic');
    certifications = await loadData('certifications');
    contact = await loadData('contact');
    reviews = await loadData('reviews');
    complementary = await loadData('complementary');
  }
  
  type TerminalLine = {
    prompt: string;
    command: string;
    output: string[];
    isError: boolean;
  };

  type CommandFunction = (args: string[]) => string[];
  
  interface Command {
    description: string;
    execute: CommandFunction;
  }
  
  interface CommandsDirectory {
    [key: string]: Command;
  }
  
  interface FileSystemDirectories {
    [path: string]: string[];
  }
  
  interface FileSystemFiles {
    [path: string]: string;
  }
  
  // Terminal state
  let terminalHistory: TerminalLine[] = [];
  let currentCommand = '';
  let terminalContainer: HTMLElement;
  let terminalHistoryElement: HTMLElement;
  let commandInput: HTMLInputElement;
  let currentDirectory = '~';
  let commandHistory: string[] = [];
  let historyIndex = -1;
  
  // User data for portfolio
  const portfolioData = {
    directories: {} as FileSystemDirectories,
    files: {} as FileSystemFiles
  };
  
  // Available commands
  const commands: CommandsDirectory = {
    help: {
      description: 'Show list of available commands',
      execute: (): string[] => {
        return Object.entries(commands).map(([cmd, { description }]) => 
          `${cmd.padEnd(15)} - ${$t(`softwares.terminal.commands.${cmd}`)}`
        );
      }
    },
    clear: {
      description: 'Clear terminal screen',
      execute: (): string[] => {
        terminalHistory = [];
        return [];
      }
    },
    echo: {
      description: 'Echo a message',
      execute: (args: string[]): string[] => {
        return [args.join(' ')];
      }
    },
    whoami: {
      description: 'Display current user',
      execute: (): string[] => {
        return [information.name];
      }
    },
    ls: {
      description: 'List directory contents',
      execute: (args: string[]): string[] => {
        const path = args[0] || currentDirectory;
        const normalizedPath = normalizePath(path);
        
        if (portfolioData.directories[normalizedPath]) {
          return portfolioData.directories[normalizedPath];
        } else {
          return [`ls: ${path}: ${$t('softwares.terminal.noSuchDirectory')}`];
        }
      }
    },
    cd: {
      description: 'Change directory',
      execute: (args: string[]): string[] => {
        if (!args[0] || args[0] === '~') {
          currentDirectory = '~';
          return [];
        }
        
        const path = args[0];
        const normalizedPath = path.startsWith('/') || path.startsWith('~') 
          ? normalizePath(path)
          : normalizePath(`${currentDirectory}/${path}`);
        
        if (portfolioData.directories[normalizedPath]) {
          currentDirectory = normalizedPath;
          return [];
        } else {
          return [`cd: ${path}: ${$t('softwares.terminal.noSuchDirectory')}`];
        }
      }
    },
    pwd: {
      description: 'Print working directory',
      execute: (): string[] => {
        return [currentDirectory];
      }
    },
    cat: {
      description: 'Concatenate and display file content',
      execute: (args: string[]): string[] => {
        if (!args[0]) {
          return [$t('softwares.terminal.missingFileOperand')];
        }
        
        const path = args[0];
        const normalizedPath = path.startsWith('/') || path.startsWith('~') 
          ? normalizePath(path)
          : normalizePath(`${currentDirectory}/${path}`);
        
        if (portfolioData.files[normalizedPath]) {
          return portfolioData.files[normalizedPath].split('\n');
        } else {
          return [`cat: ${path}: ${$t('softwares.terminal.noSuchFile')}`];
        }
      }
    },
    profile: {
      description: 'Display profile information',
      execute: (): string[] => {
        return [
          `${$t('profile.name')}: ${information.fullName}`,
          `${$t('profile.job')}: ${information.job}`,
          `${$t('profile.email')}: ${information.email}`,
          `${$t('profile.location')}: ${information.location}`,
          `Website: ${information.website}`
        ];
      }
    },
    projects: {
      description: 'List all projects',
      execute: (): string[] => {
        return projects.relevant.projects.map((project: {name: string; description: string; image: string, url: string}) => 
          `${project.name} - ${project.description} (${project.url})`
        );
      }
    },
    skills: {
      description: 'List all skills',
      execute: (): string[] => {
        return [`${$t('profile.skills')}: ${skills.skills.map((skill: {name: string}) => skill.name).join(', ')}`];
      }
    },
    contact: {
      description: 'Display contact information',
      execute: (): string[] => {
        return [
          `${$t('profile.email')}: ${information.email}`,
          `GitHub: ${contact.rrss.find((r: {name: string}) => r.name === 'GitHub')?.url}`,
          `LinkedIn: ${contact.rrss.find((r: {name: string}) => r.name === 'LinkedIn')?.url}`,
          `Discord: ${contact.rrss.find((r: {name: string}) => r.name === 'Discord')?.url}`
        ];
      }
    },
    date: {
      description: 'Display current date and time',
      execute: (): string[] => {
        return [new Date().toString()];
      }
    }
  };
  
  // Helper function to normalize paths
  function normalizePath(path: string): string {
    if (path === '~') return '~';
    
    let normalizedPath = path.replace(/\/+/g, '/');
    if (!normalizedPath.startsWith('~')) {
      normalizedPath = `~/${normalizedPath}`;
    }
    
    // Handle .. (parent directory)
    const parts = normalizedPath.split('/');
    const result = [];
    
    for (const part of parts) {
      if (part === '..') {
        result.pop();
      } else if (part && part !== '.') {
        result.push(part);
      }
    }
    
    return result.join('/');
  }
  
  // Optimized function to scroll to the bottom
  function scrollToBottom(): void {
    if (terminalHistoryElement) {
      terminalHistoryElement.scrollTop = terminalHistoryElement.scrollHeight;
    }
  }
  
  // Use afterUpdate for automatic scrolling
  afterUpdate(scrollToBottom);
  
  // Add a command and its output to history
  function addToHistory(prompt: string, command: string, output: string[], isError: boolean): void {
    terminalHistory = [...terminalHistory, { prompt, command, output, isError }];
  }
  
  // Execute a command and add to history
  function executeCommand(command: string): void {
    if (!command.trim()) {
      addToHistory(currentDirectory, '', [], false);
      return;
    }
    
    const parts = command.trim().split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);
    
    if (commands[cmd]) {
      try {
        const output = commands[cmd].execute(args);
        addToHistory(currentDirectory, command, output, false);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : $t('softwares.terminal.unknownError');
        addToHistory(currentDirectory, command, [`${$t('softwares.terminal.errorExecuting')}: ${errorMessage}`], true);
      }
    } else {
      addToHistory(currentDirectory, command, 
        [`${$t('softwares.terminal.commandNotFound')}: ${cmd}. ${$t('softwares.terminal.typeHelp')}`], 
        true);
    }
    
    // Add to command history - limit to 50 commands to avoid excessive memory consumption
    if (command.trim()) {
      commandHistory.unshift(command);
      if (commandHistory.length > 50) {
        commandHistory = commandHistory.slice(0, 50);
      }
      historyIndex = -1;
    }
    
    // Limit terminal history to 100 lines to avoid performance issues
    if (terminalHistory.length > 100) {
      terminalHistory = terminalHistory.slice(-100);
    }
  }
  
  // Handle key events
  function handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      const commandToExecute = currentCommand;
      currentCommand = ''; // Clear input immediately
      executeCommand(commandToExecute);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (commandHistory.length > 0) {
        historyIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
        currentCommand = commandHistory[historyIndex];
      }
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        currentCommand = commandHistory[historyIndex];
      } else if (historyIndex === 0) {
        historyIndex = -1;
        currentCommand = '';
      }
    } else if (event.key === 'Tab') {
      event.preventDefault();
      // Simple tab completion for commands
      if (currentCommand.trim().indexOf(' ') === -1) {
        const prefix = currentCommand.trim().toLowerCase();
        const matches = Object.keys(commands).filter(cmd => cmd.startsWith(prefix));
        
        if (matches.length === 1) {
          currentCommand = matches[0] + ' ';
        }
      }
    }
  }
  
  // Focus input on terminal click
  function focusInput(): void {
    if (commandInput) {
      commandInput.focus();
    }
  }
  
  // Handle keyboard events in the container
  function handleContainerKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      focusInput();
    }
  }
  
  // Function to update data and UI when language changes
  function updateDataAndUIOnLanguageChange() {
    loadAllData().then(() => {
      // Function to sanitize file names (replace spaces with underscores)
      const sanitizeFileName = (name: string) => name.replace(/\s+/g, '_');
      
      // Map skills with sanitized names for directories
      const sanitizedSkillNames = skills.skills.map((skill: {name: string}) => {
        return {
          original: skill.name,
          sanitized: sanitizeFileName(skill.name)
        };
      });
      
      // Update files dynamically after loading data
      portfolioData.directories = {
        '~': ['profile', 'projects', 'skills', 'contact'],
        '~/profile': ['info.txt'],
        '~/projects': ['relevant', 'personal', 'professional'],
        '~/projects/relevant': projects.relevant.projects.map((project: {name: string}) => sanitizeFileName(project.name)),
        '~/projects/personal': projects.personal.projects.map((project: {name: string}) => sanitizeFileName(project.name)),
        '~/projects/professional': projects.professional.projects.map((project: {name: string}) => sanitizeFileName(project.name)),
        '~/skills': sanitizedSkillNames.map((item: {sanitized: string}) => item.sanitized),
        '~/contact': ['email.txt', 'social.txt']
      } as FileSystemDirectories;
      
      // Create files for each project
      const projectFiles = {} as Record<string, string>;
      
      // Add information for relevant projects
      projects.relevant.projects.forEach((project: {name: string; description: string; url: string}) => {
        projectFiles[`~/projects/relevant/${sanitizeFileName(project.name)}`] = 
          `${project.name}\n\n${project.description}\n\nURL: ${project.url}`;
      });
      
      // Add information for personal projects
      projects.personal.projects.forEach((project: {name: string; description: string; url: string}) => {
        projectFiles[`~/projects/personal/${sanitizeFileName(project.name)}`] = 
          `${project.name}\n\n${project.description}\n\nURL: ${project.url}`;
      });
      
      // Add information for professional projects
      projects.professional.projects.forEach((project: {name: string; description: string; url: string}) => {
        projectFiles[`~/projects/professional/${sanitizeFileName(project.name)}`] = 
          `${project.name}\n\n${project.description}\n\nURL: ${project.url}`;
      });
      
      // Create files for each skill
      const skillFiles = {} as Record<string, string>;
      
      // Add information for skills
      skills.skills.forEach((skill: {name: string; percentage: number; items?: string[]}) => {
        let content = `${skill.name}\n\n${$t('profile.skills')}: ${skill.percentage}%`;
        
        if (skill.items && skill.items.length > 0) {
          content += `\n\n${$t('profile.softwareTools')}:\n${skill.items.join('\n')}`;
        }
        
        skillFiles[`~/skills/${sanitizeFileName(skill.name)}`] = content;
      });
      
      portfolioData.files = {
        '~/profile/info.txt': `${$t('profile.name')}: ${information.name}\n${$t('profile.job')}: ${information.job}\n${$t('profile.location')}: ${information.location}\nWebsite: ${information.website}`,
        '~/contact/email.txt': `${information.email}`,
        '~/contact/social.txt': `${contact.rrss.map((rrss: {name: string, url: string}) => `${rrss.name}: ${rrss.url}`).join('\n')}`,
        ...projectFiles,
        ...skillFiles
      } as FileSystemFiles;
      
      // Clear current history and add translated welcome message
      terminalHistory = [];
      addToHistory('~', '', [$t('softwares.terminal.welcome')], false);
    });
  }
  
  onMount(() => {
    loadAllData().then(() => {
      // Update files dynamically after loading data
      
      // Function to sanitize file names (replace spaces with underscores)
      const sanitizeFileName = (name: string) => name.replace(/\s+/g, '_');
      
      // Map skills with sanitized names for directories
      const sanitizedSkillNames = skills.skills.map((skill: {name: string}) => {
        return {
          original: skill.name,
          sanitized: sanitizeFileName(skill.name)
        };
      });
      
      portfolioData.directories = {
        '~': ['profile', 'projects', 'skills', 'contact'],
        '~/profile': ['info.txt'],
        '~/projects': ['relevant', 'personal', 'professional'],
        '~/projects/relevant': projects.relevant.projects.map((project: {name: string}) => sanitizeFileName(project.name)),
        '~/projects/personal': projects.personal.projects.map((project: {name: string}) => sanitizeFileName(project.name)),
        '~/projects/professional': projects.professional.projects.map((project: {name: string}) => sanitizeFileName(project.name)),
        '~/skills': sanitizedSkillNames.map((item: {sanitized: string}) => item.sanitized),
        '~/contact': ['email.txt', 'social.txt']
      } as FileSystemDirectories;
      
      // Create files for each project
      const projectFiles = {} as Record<string, string>;
      
      // Add information for relevant projects
      projects.relevant.projects.forEach((project: {name: string; description: string; url: string}) => {
        projectFiles[`~/projects/relevant/${sanitizeFileName(project.name)}`] = 
          `${project.name}\n\n${project.description}\n\nURL: ${project.url}`;
      });
      
      // Add information for personal projects
      projects.personal.projects.forEach((project: {name: string; description: string; url: string}) => {
        projectFiles[`~/projects/personal/${sanitizeFileName(project.name)}`] = 
          `${project.name}\n\n${project.description}\n\nURL: ${project.url}`;
      });
      
      // Add information for professional projects
      projects.professional.projects.forEach((project: {name: string; description: string; url: string}) => {
        projectFiles[`~/projects/professional/${sanitizeFileName(project.name)}`] = 
          `${project.name}\n\n${project.description}\n\nURL: ${project.url}`;
      });
      
      // Create files for each skill
      const skillFiles = {} as Record<string, string>;
      
      // Add information for skills
      skills.skills.forEach((skill: {name: string; percentage: number; items?: string[]}) => {
        let content = `${skill.name}\n\n${$t('profile.skills')}: ${skill.percentage}%`;
        
        if (skill.items && skill.items.length > 0) {
          content += `\n\n${$t('profile.softwareTools')}:\n${skill.items.join('\n')}`;
        }
        
        skillFiles[`~/skills/${sanitizeFileName(skill.name)}`] = content;
      });
      
      portfolioData.files = {
        '~/profile/info.txt': `${$t('profile.name')}: ${information.name}\n${$t('profile.job')}: ${information.job}\n${$t('profile.location')}: ${information.location}\nWebsite: ${information.website}`,
        '~/contact/email.txt': `${information.email}`,
        '~/contact/social.txt': `${contact.rrss.map((rrss: {name: string, url: string}) => `${rrss.name}: ${rrss.url}`).join('\n')}`,
        ...projectFiles,
        ...skillFiles
      } as FileSystemFiles;
      
      focusInput();
      addToHistory('~', '', [$t('softwares.terminal.welcome')], false);
    });
    
    // Subscribe to language changes
    const unsubscribe = locale.subscribe(() => {
      updateDataAndUIOnLanguageChange();
    });
    
    return () => {
      unsubscribe();
    };
  });
</script>

<div 
  class="terminal-container" 
  bind:this={terminalContainer} 
  on:click={focusInput}
  on:keydown={handleContainerKeydown}
  aria-label={$t('softwares.terminal.title')}
  role="button"
  tabindex="0">
  <div class="terminal-history" bind:this={terminalHistoryElement}>
    {#each terminalHistory as line}
      <div class="terminal-line">
        {#if line.command !== ''}
          <span class="prompt">{line.prompt}$</span>
          <span class="command">{line.command}</span>
        {/if}
        {#each line.output as output}
          <div class="output" class:error={line.isError}>{output}</div>
        {/each}
      </div>
    {/each}
  </div>
  
  <div class="terminal-input">
    <span class="prompt">{currentDirectory}$</span>
    <input
      type="text"
      bind:value={currentCommand}
      bind:this={commandInput}
      on:keydown={handleKeydown}
      autocomplete="off"
      spellcheck="false"
      aria-label={$t('softwares.terminal.commands.input')}
    />
  </div>
</div>

<style>
  .terminal-container {
    width: 100%;
    height: 100%;
    background-color: #1e1e1e;
    color: #f0f0f0;
    font-family: 'Consolas', 'Courier New', monospace;
    font-size: 14px;
    padding: 10px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  
  .terminal-history {
    flex: 1;
    overflow-y: auto;
    margin-bottom: 10px;
    scroll-behavior: auto;
    -webkit-overflow-scrolling: touch;
  }
  
  .terminal-line {
    margin-bottom: 5px;
    white-space: pre-wrap;
    word-break: break-all;
  }
  
  .prompt {
    color: #4ec9b0;
    margin-right: 8px;
    font-weight: bold;
  }
  
  .command {
    color: #dcdcaa;
  }
  
  .output {
    color: #cccccc;
    padding: 0 8px;
  }
  
  .error {
    color: #f44747;
  }
  
  .terminal-input {
    display: flex;
    align-items: center;
  }
  
  input {
    flex: 1;
    background-color: transparent;
    border: none;
    color: #dcdcaa;
    font-family: 'Consolas', 'Courier New', monospace;
    font-size: 14px;
    outline: none;
    caret-color: #ffffff;
  }

  /* Scrollbar styling */
  .terminal-history::-webkit-scrollbar {
    width: 8px;
  }
  
  .terminal-history::-webkit-scrollbar-track {
    background: #1e1e1e;
  }
  
  .terminal-history::-webkit-scrollbar-thumb {
    background: #555;
    border-radius: 4px;
  }
  
  .terminal-history::-webkit-scrollbar-thumb:hover {
    background: #777;
  }
</style> 