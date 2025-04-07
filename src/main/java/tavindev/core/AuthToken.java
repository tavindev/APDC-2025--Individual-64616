package tavindev.core;

import tavindev.core.entities.UserRole;

import java.util.UUID;

public class AuthToken {
	public static final long EXPIRATION_TIME = 1000 * 60 * 60 * 2;
	
	private String username;
	private UserRole userRole;
	private TokenData tokenData;

	public record TokenData(String id, long creationData, long expirationData) {}
	
	public AuthToken(String username, UserRole role) {
		this.username = username;
		this.userRole = role;
		this.tokenData = new TokenData(UUID.randomUUID().toString(), System.currentTimeMillis(), System.currentTimeMillis() + EXPIRATION_TIME);
	}

	public AuthToken(String username, UserRole role, TokenData tokenData) {
		this.username = username;
		this.userRole = role;
		this.tokenData = tokenData;
	}

	public boolean isExpired() {
		return System.currentTimeMillis() > tokenData.expirationData;
	}

	public String getUsername() {
		return username;
	}

	public UserRole getUserRole() {
		return userRole;
	}
	
	public String getTokenId() {
		return tokenData.id;
	}

	public long getCreationData() {
		return tokenData.creationData;
	}

	public long getExpirationData() {
		return tokenData.expirationData;
	}
}
