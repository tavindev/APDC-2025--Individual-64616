package tavindev.core.services;

import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import tavindev.core.UserRepository;
import tavindev.core.entities.*;
import tavindev.core.exceptions.PasswordDoesntMatchException;
import tavindev.core.exceptions.UserAlreadyExistsException;
import tavindev.infra.dto.RegisterUserDTO;

import java.util.Optional;

public class UserService {
    @Inject
    private UserRepository userRepository;

    public void registerUser(@NotNull @Valid RegisterUserDTO registerUserDTO) {
        User existing = this.userRepository.findByEmail(registerUserDTO.email());

        if (existing != null)
            throw new UserAlreadyExistsException();

        if (registerUserDTO.isPasswordNotMatch()) {
            throw new PasswordDoesntMatchException();
        }

        PersonalInfo personalInfo = new PersonalInfo(
            registerUserDTO.email(),
            registerUserDTO.username(),
            registerUserDTO.fullName(),
            registerUserDTO.phoneNumber(),
            registerUserDTO.password(),
            Optional.of(registerUserDTO.photo())
        );

        IdentificationInfo identificationInfo = new IdentificationInfo(
            Optional.of(registerUserDTO.citizenCardNumber()),
            Optional.of(registerUserDTO.taxNumber()),
            Optional.of(registerUserDTO.address())
        );

        ProfessionalInfo professionalInfo = new ProfessionalInfo(
            Optional.of(registerUserDTO.employer()),
            Optional.of(registerUserDTO.jobTitle()),
            Optional.of(registerUserDTO.employerTaxNumber())
        );

        User user = new User(
            personalInfo,
            identificationInfo,
            professionalInfo,
            UserProfile.valueOf(registerUserDTO.profile()),
            UserRole.ENDUSER,
            AccountStatus.DESATIVADA
        );

        this.userRepository.save(user);
    }
}
