import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Converter } from './Converter';
import * as Wagmi from 'wagmi';
import * as ConnectKit from 'connectkit';
import * as UsePriceHook from '@/lib/hooks/use-price';
import * as UseDebounceHook from '@/lib/hooks/use-debounce';

// Mock Wagmi hooks
vi.mock('wagmi', async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    ...actual,
    useAccount: vi.fn(),
    useBalance: vi.fn(),
    useSwitchChain: vi.fn(),
  };
});

// Mock ConnectKit hooks
vi.mock('connectkit', async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    ...actual,
    useModal: vi.fn(),
  };
});

// Mock custom hooks
vi.mock('@/lib/hooks/use-price', () => ({
  usePrice: vi.fn(),
}));
vi.mock('@/lib/hooks/use-debounce', () => ({
  useDebounce: vi.fn((value) => value), // Return value immediately for tests
}));

describe('Converter Component - Input Validation', () => {
  const mockSetOpen = vi.fn();
  const mockSwitchChain = vi.fn();
  const mockRefetchPrice = vi.fn();

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();

    // Default mock implementations for connected state on Mainnet
    vi.mocked(Wagmi.useAccount).mockReturnValue({
      isConnected: true,
      chainId: 1, // Ethereum Mainnet
      address: '0x123FakeAddress456',
    } as any); // Type assertion for simplicity

    vi.mocked(Wagmi.useBalance).mockImplementation((params) => {
      if (!params) return { data: undefined, isLoading: true, isError: false } as any;
      if (params.token === '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48') { // USDC
        return { data: { formatted: '1000', value: BigInt(1000 * 1e6) }, isLoading: false, isError: false } as any;
      } else if (params.token === '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599') { // wBTC
        return { data: { formatted: '10', value: BigInt(10 * 1e8) }, isLoading: false, isError: false } as any;
      } else if (params.address) { // ETH
        return { data: { formatted: '5', value: BigInt(5 * 1e18) }, isLoading: false, isError: false } as any;
      }
      return { data: undefined, isLoading: true, isError: false } as any;
    });

    vi.mocked(Wagmi.useSwitchChain).mockReturnValue({
      switchChain: mockSwitchChain,
      chains: [],
      isPending: false,
    } as any);

    vi.mocked(ConnectKit.useModal).mockReturnValue({
      setOpen: mockSetOpen,
    } as any);

    vi.mocked(UsePriceHook.usePrice).mockReturnValue({
      usdPrice: 30000,
      isLoading: false,
      error: null,
      errorObj: null,
      refetch: mockRefetchPrice,
    });
  });

  it('should allow valid USD input with up to two decimal places and truncate excess', async () => {
    render(<Converter />);
    const usdInput = screen.getByPlaceholderText('Enter USD amount');

    fireEvent.change(usdInput, { target: { value: '100.12' } });
    expect(usdInput).toHaveValue('100.12');

    fireEvent.change(usdInput, { target: { value: '100.12345' } });
    expect(usdInput).toHaveValue('100.12'); // Truncated
  });

  it('should allow valid wBTC input with up to eight decimal places and truncate excess', async () => {
    render(<Converter />);
    const reverseButton = screen.getByLabelText('Reverse currencies');
    fireEvent.click(reverseButton); // Switch to wBTC -> USD mode

    const wbtcInput = screen.getByPlaceholderText('Enter wBTC amount');

    fireEvent.change(wbtcInput, { target: { value: '0.12345678' } });
    expect(wbtcInput).toHaveValue('0.12345678');

    fireEvent.change(wbtcInput, { target: { value: '0.12345678910' } });
    expect(wbtcInput).toHaveValue('0.12345678'); // Truncated
  });

  it('should clear output and set loading when input changes', async () => {
    render(<Converter />);
    const usdInput = screen.getByPlaceholderText('Enter USD amount');
    const wbtcInput = screen.getByPlaceholderText('Enter wBTC amount');

    fireEvent.change(usdInput, { target: { value: '100' } });
    await waitFor(() => {
      expect(wbtcInput).toHaveValue('0.00333333'); // Initial calculated value
    });

    fireEvent.change(usdInput, { target: { value: '200' } });
    expect(wbtcInput).toHaveValue(''); // Should clear on new input
    expect(screen.getByPlaceholderText('Enter wBTC amount')).toHaveAttribute('min-h-[48px]'); // Check for loading state (skeleton, though not exact match)

    // Simulate price refetch completion
    vi.mocked(UsePriceHook.usePrice).mockReturnValueOnce({
      usdPrice: 30000,
      isLoading: false,
      error: null,
      errorObj: null,
      refetch: mockRefetchPrice,
    });

    fireEvent.change(usdInput, { target: { value: '200' } });

    await waitFor(() => {
      expect(wbtcInput).toHaveValue('0.00666667'); // Updated calculated value
    });
  });

  it('should not allow invalid characters in USD input', () => {
    render(<Converter />);
    const usdInput = screen.getByPlaceholderText('Enter USD amount');

    fireEvent.change(usdInput, { target: { value: '100a' } });
    expect(usdInput).toHaveValue(''); // Should not update

    fireEvent.change(usdInput, { target: { value: 'abc' } });
    expect(usdInput).toHaveValue(''); // Should not update
  });

  it('should not allow invalid characters in wBTC input', () => {
    render(<Converter />);
    const reverseButton = screen.getByLabelText('Reverse currencies');
    fireEvent.click(reverseButton); // Switch to wBTC -> USD mode

    const wbtcInput = screen.getByPlaceholderText('Enter wBTC amount');

    fireEvent.change(wbtcInput, { target: { value: '0.1b2' } });
    expect(wbtcInput).toHaveValue(''); // Should not update

    fireEvent.change(wbtcInput, { target: { value: 'xyz' } });
    expect(wbtcInput).toHaveValue(''); // Should not update
  });

  it('should display insufficient balance for USD when input exceeds balance', async () => {
    vi.mocked(Wagmi.useBalance).mockImplementation((params) => {
      if (!params) return { data: undefined, isLoading: true, isError: false } as any;
      if (params.token === '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48') { // USDC
        return { data: { formatted: '500', value: BigInt(500 * 1e6) }, isLoading: false, isError: false } as any;
      }
      return { data: undefined, isLoading: true, isError: false } as any;
    });

    render(<Converter />);
    const usdInput = screen.getByPlaceholderText('Enter USD amount');
    const convertButton = screen.getByRole('button', { name: /Convert/i });

    fireEvent.change(usdInput, { target: { value: '1000' } });

    await waitFor(() => {
      expect(convertButton).toHaveTextContent('Insufficient Balance');
      expect(convertButton).toBeDisabled();
    });
  });

  it('should display insufficient balance for wBTC when input exceeds balance', async () => {
    vi.mocked(Wagmi.useBalance).mockImplementation((params) => {
      if (!params) return { data: undefined, isLoading: true, isError: false } as any;
      if (params.token === '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599') { // wBTC
        return { data: { formatted: '0.5', value: BigInt(0.5 * 1e8) }, isLoading: false, isError: false } as any;
      }
      return { data: undefined, isLoading: true, isError: false } as any;
    });

    render(<Converter />);
    const reverseButton = screen.getByLabelText('Reverse currencies');
    fireEvent.click(reverseButton); // Switch to wBTC -> USD mode

    const wbtcInput = screen.getByPlaceholderText('Enter wBTC amount');
    const convertButton = screen.getByRole('button', { name: /Convert/i });

    fireEvent.change(wbtcInput, { target: { value: '1.0' } });

    await waitFor(() => {
      expect(convertButton).toHaveTextContent('Insufficient Balance');
      expect(convertButton).toBeDisabled();
    });
  });
}); 